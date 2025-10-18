import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AssetStore } from "../../stores/asset";
import { Loader2, Package, ExternalLink, Mail, Building2, Hash, Archive } from "lucide-react";

export default function AssetList() {
    const { idDanhMucTaiSan } = useParams();
    const taisanStore = AssetStore();
    const { getAssetByIdCategory } = taisanStore;
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await getAssetByIdCategory(idDanhMucTaiSan);
                setAssets(res);
            } catch (err) {
                console.error("Lỗi load tài sản:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, [idDanhMucTaiSan]);

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

    if (assets.length === 0) {
        return (
            <div className="p-4 md:p-6">
                <div className="text-center py-8 md:py-12">
                    <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base md:text-lg">
                        Không có tài sản nào cho danh mục này.
                    </p>
                </div>
            </div>
        );
    }

    const categoryName = assets[0]?.danh_muc_tai_san_ten;

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header - Responsive */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 md:p-6 mb-4 md:mb-6 text-white shadow-lg">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                        <Package className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                            Danh sách tài sản
                        </h1>
                        {categoryName && (
                            <p className="text-blue-100 mt-1 text-sm md:text-base truncate">
                                Danh mục: {categoryName}
                            </p>
                        )}
                        <p className="text-blue-100 text-xs md:text-sm mt-1">
                            {assets.length} tài sản được tìm thấy
                        </p>
                    </div>
                </div>
            </div>

            {/* Asset Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                            <h3 className="font-bold text-lg md:text-xl text-gray-800 leading-tight line-clamp-2">
                                {asset.ten_tai_san}
                            </h3>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-3">
                            {/* Supplier */}
                            <div className="flex items-start gap-2">
                                <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                                        Nhà cung cấp
                                    </span>
                                    <span className="text-sm text-gray-800 font-medium break-words">
                                        {asset.ten_nha_cung_cap}
                                    </span>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="flex items-start gap-2">
                                <Package className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                                        Danh mục
                                    </span>
                                    <span className="text-sm text-gray-800 font-medium break-words">
                                        {asset.danh_muc_tai_san_ten}
                                    </span>
                                </div>
                            </div>

                            {/* Contact */}
                            {asset.danh_muc_tai_san_lien_he && (
                                <div className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                                            Liên hệ
                                        </span>
                                        <a
                                            href={`mailto:${asset.danh_muc_tai_san_lien_he}`}
                                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                                        >
                                            {asset.danh_muc_tai_san_lien_he}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Website */}
                            {asset.danh_muc_tai_san_link && (
                                <div className="flex items-start gap-2">
                                    <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                                            Website
                                        </span>
                                        <a
                                            href={asset.danh_muc_tai_san_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all inline-flex items-center gap-1"
                                        >
                                            <span className="truncate">{asset.danh_muc_tai_san_link}</span>
                                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Quantity Information */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                                            Tổng SL
                                        </span>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {asset.tong_so_luong}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Archive className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                                            Còn lại
                                        </span>
                                        <span className="text-sm font-semibold text-green-600">
                                            {asset.so_luong_con}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            {asset.thong_tin && (asset.thong_tin.loai || asset.thong_tin.module) && (
                                <div className="pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-2">
                                        Thông tin bổ sung
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {asset.thong_tin.loai && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Loại: {asset.thong_tin.loai}
                                            </span>
                                        )}
                                        {asset.thong_tin.module && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Module: {asset.thong_tin.module}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}