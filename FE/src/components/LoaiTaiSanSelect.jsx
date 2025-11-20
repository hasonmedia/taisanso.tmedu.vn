import React, { useState, useEffect } from 'react';
// Giả sử bạn dùng alias "@/components/ui/select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Giả sử bạn dùng alias "@/stores/loaiTaiSan"
import { LoaiTaiSanStore } from '@/stores/loaiTaiSan';

/**
 * Component Select để chọn Loại Tài Sản, có khả năng lọc theo Danh Mục.
 * @param {object} props
 * @param {string | null} props.value - Giá trị id của loại tài sản đang được chọn.
 * @param {(value: string) => void} props.onValueChange - Hàm callback khi giá trị thay đổi.
 * @param {string} [props.placeholder="Chọn loại tài sản"] - Placeholder cho SelectTrigger.
 * @param {string | number | null} [props.categoryId=null] - ID của danh mục để lọc (nếu có).
 */
const LoaiTaiSanSelect = ({
    value,
    onValueChange,
    placeholder = "Chọn loại tài sản",
    categoryId = null
}) => {
    // 1. Khởi tạo loading là true để luôn hiển thị trạng thái tải khi mount hoặc categoryId thay đổi
    const [loading, setLoading] = useState(true);
    const { data: loaiTaiSans, getAllLoaiTaiSan } = LoaiTaiSanStore();

    useEffect(() => {
        const fetchLoaiTaiSan = async () => {
            // 2. Luôn set loading là true khi bắt đầu fetch
            setLoading(true);
            try {
                if (categoryId) {
                    await getAllLoaiTaiSan({ danhMucTaiSanId: categoryId });
                } else {
                    await getAllLoaiTaiSan();
                }
            } catch (error) {
                console.error('Lỗi khi tải loại tài sản:', error);
                // Bạn có thể muốn xử lý lỗi ở đây, ví dụ: set một state lỗi
            } finally {
                setLoading(false);
            }
        };

        fetchLoaiTaiSan();
        // Phụ thuộc vào categoryId và hàm fetch
    }, [categoryId, getAllLoaiTaiSan]);

    console.log("LoaiTaiSans (Render):", loaiTaiSans, "Loading:", loading);

    // Xác định placeholder động
    const dynamicPlaceholder = loading
        ? "Đang tải..."
        : placeholder;

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            // Vẫn giữ logic disable của bạn, nhưng cũng disable khi đang loading
            disabled={loading || (!categoryId && placeholder.includes("Vui lòng chọn danh mục"))}
        >
            <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors">
                <SelectValue placeholder={dynamicPlaceholder} />
            </SelectTrigger>
            <SelectContent>
                {/* 3. Thay đổi logic render: Ưu tiên check loading TRƯỚC TIÊN */}
                {loading ? (

                    <p className="py-1.5 px-2 text-sm text-muted-foreground">
                        Đang tải...
                    </p>
                ) : loaiTaiSans && loaiTaiSans.length > 0 ? (
                    // Nếu không loading VÀ có dữ liệu, map qua dữ liệu
                    loaiTaiSans.map((loaiTaiSan) => (
                        <SelectItem key={loaiTaiSan.id} value={String(loaiTaiSan.id)}>
                            {loaiTaiSan.ten}
                        </SelectItem>
                    ))
                ) : (
                    // Nếu không loading VÀ không có dữ liệu, hiển thị "Không có"
                    // Sử dụng một thẻ p thay vì SelectItem
                    <p className="py-1.5 px-2 text-sm text-muted-foreground">
                        Không có loại tài sản
                    </p>
                )}
            </SelectContent>
        </Select>
    );
};

export default LoaiTaiSanSelect;