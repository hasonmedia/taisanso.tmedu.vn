import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LoaiTaiSanStore } from '@/stores/loaiTaiSan';
const LoaiTaiSanSelect = ({ value, onValueChange, placeholder = "Chọn loại tài sản" }) => {
    const [loading, setLoading] = useState(false);
    const { data: loaiTaiSans, getAllLoaiTaiSan } = LoaiTaiSanStore();
    useEffect(() => {
        getAllLoaiTaiSan();
    }, []);

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors">
                <SelectValue placeholder={loading ? "Đang tải..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
                {loaiTaiSans.map((loaiTaiSan) => (
                    <SelectItem key={loaiTaiSan.id} value={loaiTaiSan.id}>
                        {loaiTaiSan.ten}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default LoaiTaiSanSelect;