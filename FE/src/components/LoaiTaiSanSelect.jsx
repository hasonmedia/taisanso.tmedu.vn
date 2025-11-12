import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LoaiTaiSanStore } from '../stores/loaiTaiSan';
const LoaiTaiSanSelect = ({ value, onValueChange, placeholder = "Chọn loại tài sản", categoryId = null }) => {
    const [loading, setLoading] = useState(false);
    const { data: loaiTaiSans, getAllLoaiTaiSan } = LoaiTaiSanStore();

    useEffect(() => {
        const fetchLoaiTaiSan = async () => {
            setLoading(true);
            try {
                if (categoryId) {
                    // Lọc theo danh mục tài sản
                    await getAllLoaiTaiSan({ danhMucTaiSanId: categoryId });
                } else {
                    // Lấy tất cả loại tài sản
                    await getAllLoaiTaiSan();
                }
            } catch (error) {
                console.error('Lỗi khi tải loại tài sản:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLoaiTaiSan();
    }, [categoryId, getAllLoaiTaiSan]);

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            disabled={loading || (!categoryId && placeholder.includes("Vui lòng chọn danh mục"))}
        >
            <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors">
                <SelectValue placeholder={loading ? "Đang tải..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
                {loaiTaiSans && loaiTaiSans.length > 0 ? (
                    loaiTaiSans.map((loaiTaiSan) => (
                        <SelectItem key={loaiTaiSan.id} value={String(loaiTaiSan.id)}>
                            {loaiTaiSan.ten}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="" disabled>
                        {loading ? "Đang tải..." : "Không có loại tài sản"}
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};

export default LoaiTaiSanSelect;