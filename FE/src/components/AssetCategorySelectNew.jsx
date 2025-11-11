import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ThuongHieuStore } from '@/stores/thuonghieu';
const AssetCategorySelectNew = ({ value, onValueChange, placeholder = "Chọn danh mục tài sản" }) => {
    const [loading, setLoading] = useState(false);
    const { data: categories, getAllThuongHieu } = ThuongHieuStore();
    useEffect(() => {
        getAllThuongHieu();
    }, []);
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors">
                <SelectValue placeholder={loading ? "Đang tải..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
                {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                        {category.ten}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default AssetCategorySelectNew;