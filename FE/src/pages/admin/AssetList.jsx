import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react'; // Giả sử bạn import icon
import { AssetStore } from '../../stores/asset'; // Cập nhật đường dẫn store

// Helper function để chuyển API status sang Display status
const getDisplayStatus = (apiStatus) => {
    switch (apiStatus) {
        case 'normal':
            return 'safe'; // Yêu cầu: "normal thì safe"

        case 'expired':
            return 'expired'; // Yêu cầu: "expired"
        case 'critical':
        case 'warning':
        case 'notice':
        case 'upcoming':
            return 'upcoming';

        default:
            return 'safe';
    }
};
const STATUS_TEXT = {
    safe: 'An toàn',
    upcoming: 'Sắp hết hạn',
    expired: 'Đã hết hạn'
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
    const { getAssetsDetailedInfo } = AssetStore();

    const [loading, setLoading] = useState(true);
    // 1. Đổi tên state để rõ nghĩa hơn
    const [allCategories, setAllCategories] = useState([]);

    const statusFilter = searchParams.get('status');

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await getAssetsDetailedInfo();
                setAllCategories(res);
            } catch (err) {
                console.error("Lỗi load tài sản:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, [getAssetsDetailedInfo]);
    const categoryToDisplay = useMemo(() => {
        if (loading || allCategories.length === 0) {
            return null;
        }

        const currentCategoryId = parseInt(idDanhMucTaiSan, 10);
        const currentCategory = allCategories.find(cat => cat.id === currentCategoryId);

        if (!currentCategory) {
            return null;
        }

        if (statusFilter === 'expired') {
            const filteredTaiSans = currentCategory.TaiSans.filter(taiSan =>
                taiSan.muc_do_canh_bao == 'expired'
            );
            return {
                ...currentCategory,
                TaiSans: filteredTaiSans
            };
        }
        else if (statusFilter === 'upcoming') {
            const filteredTaiSans = currentCategory.TaiSans.filter(taiSan =>
                ['critical', 'warning', 'notice', 'upcoming'].includes(taiSan.muc_do_canh_bao)
            );
            return {
                ...currentCategory,
                TaiSans: filteredTaiSans
            };
        }

        return currentCategory;

    }, [allCategories, idDanhMucTaiSan, statusFilter, loading]);
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

    if (!categoryToDisplay || categoryToDisplay.TaiSans.length === 0) {
        return (
            <div className="p-4 md:p-6">
                <div className="text-center py-8 md:py-12">
                    <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base md:text-lg">
                        {statusFilter === 'expired'
                            ? "Không có tài sản nào sắp hết hạn."
                            : "Không có tài sản nào cho danh mục này."
                        }
                    </p>
                </div>
            </div>
        );
    }
    const categoryName = categoryToDisplay.ten;
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Danh mục: {categoryName}</h1>

            {/* Bọc bảng trong một div để xử lý overflow trên mobile */}
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Phần tiêu đề bảng */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Tên tài sản
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Nhà cung cấp
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Loại tài sản
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Trạng thái
                            </th>
                        </tr>
                    </thead>

                    {/* Phần thân bảng */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categoryToDisplay.TaiSans.map(taiSan => {
                            // Logic lấy status (giữ nguyên)
                            const apiStatus = taiSan.muc_do_canh_bao;
                            const displayStatusKey = getDisplayStatus(apiStatus);
                            const statusText = STATUS_TEXT[displayStatusKey] || displayStatusKey;
                            const statusClass = STATUS_CLASS[displayStatusKey] || 'bg-gray-100 text-gray-800';

                            // Chuyển <li> thành <tr> (table row)
                            return (
                                <tr key={taiSan.id}>
                                    {/* Mỗi <span> cũ giờ là <td> (table data) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{taiSan.ten_tai_san}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{taiSan.NhaCungCap.ten}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{taiSan.LoaiTaiSan?.ten || "Không có thông tin"}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* Status badge */}
                                        <span className={`p-1 px-2 text-xs rounded ${statusClass}`}>
                                            {statusText}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}