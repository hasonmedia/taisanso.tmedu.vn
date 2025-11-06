import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react'; // Giả sử bạn import icon
import { AssetStore } from '../../stores/asset'; // Cập nhật đường dẫn store
const STATUS_TEXT = {
    safe: 'An toàn',
    upcoming: 'Sắp hết hạn',
    expired: 'Đã hết hạn' // Hoặc 'Hết hạn' tùy bạn
};

// Ánh xạ sang class CSS (để code gọn hơn)
const STATUS_CLASS = {
    safe: 'bg-green-100 text-green-800',
    upcoming: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800'
};
export default function AssetList() {
    const { idDanhMucTaiSan } = useParams();
    const [searchParams] = useSearchParams();
    const taisanStore = AssetStore();
    const { getAssetsDetailedInfo } = taisanStore;

    const [loading, setLoading] = useState(true);
    // 1. Đổi tên state để rõ nghĩa hơn
    const [allCategories, setAllCategories] = useState([]);

    const statusFilter = searchParams.get('status');

    useEffect(() => {
        const fetchAssets = async () => {
            // Không cần setLoading(true) ở đây nếu bạn đã set ở state
            try {
                const res = await getAssetsDetailedInfo();
                setAllCategories(res); // Lưu tất cả danh mục
            } catch (err) {
                console.error("Lỗi load tài sản:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
        // API này fetch tất cả nên không cần phụ thuộc vào idDanhMucTaiSan
        // Nó chỉ cần chạy 1 lần khi component mount
    }, [getAssetsDetailedInfo]); // Chỉ phụ thuộc vào hàm lấy data

    // 2. Dùng useMemo để tính toán data hiển thị
    const categoryToDisplay = useMemo(() => {
        if (loading || allCategories.length === 0) {
            return null; // Trả về null nếu đang tải hoặc chưa có data
        }

        // Bước A: Tìm danh mục hiện tại dựa trên ID từ URL
        const currentCategoryId = parseInt(idDanhMucTaiSan, 10);
        const currentCategory = allCategories.find(cat => cat.id === currentCategoryId);

        if (!currentCategory) {
            return null; // Không tìm thấy danh mục
        }

        // Bước B: Kiểm tra statusFilter để lọc tài sản
        if (statusFilter === 'expired') {
            // Lọc mảng TaiSans
            const filteredTaiSans = currentCategory.TaiSans.filter(taiSan =>
                taiSan.muc_do_canh_bao !== 'safe' // Giả định: 'expiring' là bất cứ gì không 'safe'
            );

            // Trả về category object MỚI với TaiSans đã được lọc
            return {
                ...currentCategory,
                TaiSans: filteredTaiSans
            };
        }

        // Nếu không có filter, trả về danh mục tìm được
        return currentCategory;

    }, [allCategories, idDanhMucTaiSan, statusFilter, loading]); // Phụ thuộc vào data, ID, filter và loading

    // 3. Cập nhật logic render
    if (loading) {
        return (
            <div className="flex items-center justify-center h-40 md:h-64 text-blue-600">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                    <span className="text-sm md:text-base font-medium">Đang tải tài sản...</span>
                </div>
            </div>
        );
    }

    // Kiểm tra nếu KHÔNG tìm thấy data HOẶC mảng TaiSans (sau khi lọc) bị rỗng
    if (!categoryToDisplay || categoryToDisplay.TaiSans.length === 0) {
        return (
            <div className="p-4 md:p-6">
                <div className="text-center py-8 md:py-12">
                    <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base md:text-lg">
                        {/* Thay đổi text dựa trên filter */}
                        {statusFilter === 'expired'
                            ? "Không có tài sản nào sắp hết hạn."
                            : "Không có tài sản nào cho danh mục này."
                        }
                    </p>
                </div>
            </div>
        );
    }

    // 4. Lấy tên từ data đã xử lý
    // Dựa trên JSON của bạn, tên nằm ở `categoryToDisplay.ten`
    const categoryName = categoryToDisplay.ten;

    // Render danh sách tài sản từ `categoryToDisplay.TaiSans`
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Danh mục: {categoryName}</h1>
            <ul>
                {categoryToDisplay.TaiSans.map(taiSan => {
                    // Lấy trạng thái hiện tại
                    const statusKey = taiSan.muc_do_canh_bao; // ví dụ: 'safe'

                    // Lấy text và class tương ứng
                    const statusText = STATUS_TEXT[statusKey] || statusKey; // Lấy "An toàn"
                    const statusClass = STATUS_CLASS[statusKey] || 'bg-gray-100 text-gray-800'; // Lấy class CSS, có fallback

                    return (
                        <li key={taiSan.id} className="p-2 border-b flex justify-between items-center">
                            <span>{taiSan.ten_tai_san}</span>

                            {/* Sử dụng biến đã lấy ở trên */}
                            <span className={`ml-2 p-1 px-2 text-xs rounded ${statusClass}`}>
                                {statusText}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}