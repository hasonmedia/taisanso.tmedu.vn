import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Building2, Box, Package, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SupplierStore } from "../../stores/supplier";
import { AssetStore } from "../../stores/asset";

export default function SupplierManagement() {
    const { data: suppliers, getSuppliers, themNhaCungCap, suaNhaCungCap, xoaNhaCungCap } = SupplierStore();
    const { detailedInfo: danhmuc, getAssetsDetailedInfo } = AssetStore();
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]);

    const [isAssetsBySupplierOpen, setIsAssetsBySupplierOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [assetsBySupplier, setAssetsBySupplier] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAssetsDetailedInfo();
                await getSuppliers();
            } catch (err) {
                console.error("Failed to fetch suppliers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getSuppliers(selectedCategoryFilters);
            } catch (err) {
                console.error("Failed to fetch suppliers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCategoryFilters]);

    const toggleSupplier = (categoryId) => {
        setSelectedCategoryFilters((prevIds) => {
            if (prevIds.includes(categoryId)) {
                return prevIds.filter(id => id !== categoryId);
            } else {
                return [...prevIds, categoryId];
            }
        });
    };

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        const newSupplier = {
            ten: data.get("ten"),
            website: data.get("website"),
            lienhe: data.get("lienhe"),
            sodienthoai: data.get("sodienthoai"),
        };
        try {
            await themNhaCungCap(newSupplier);
            setIsAddOpen(false);
            form.reset();
        } catch (err) {
            console.error("Failed to add supplier:", err);
        }
    };

    const handleEditSupplier = async (e) => {
        e.preventDefault();
        if (!editingSupplier) return;

        const form = e.target;
        const data = new FormData(form);
        const updated = {
            ten: data.get("ten"),
            website: data.get("website"),
            lienhe: data.get("lienhe"),
            sodienthoai: data.get("sodienthoai"),
        };

        try {
            await suaNhaCungCap(editingSupplier.id, updated);
        } catch (err) {
            console.error("Failed to update supplier:", err);
        } finally {
            setIsEditSupplierOpen(false);
            setEditingSupplier(null);
        }
    };

    const handleDeleteSupplier = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này không?")) {
            try {
                await xoaNhaCungCap(id);
            } catch (err) {
                console.error("Failed to delete supplier:", err);
            }
        }
    };

    // Function để hiển thị tài sản theo nhà cung cấp
    const showAssetsBySupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setAssetsBySupplier(supplier.TaiSans || []);
        setIsAssetsBySupplierOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-600" />
                    <span className="text-sm md:text-base font-medium text-gray-600">Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 md:p-6 mb-4 md:mb-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                            <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                                Quản Lý Nhà Cung Cấp
                            </h1>
                            <p className="text-blue-100 text-sm md:text-base mt-1">
                                Quản lý các nhà cung cấp
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm nhà cung cấp
                    </Button>
                </div>
            </div>

            {danhmuc.length > 0 && (
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <Box className="w-4 h-4 mr-2 text-blue-500" />
                        Lọc theo Danh Mục
                        {selectedCategoryFilters.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {selectedCategoryFilters.length} đã chọn
                            </span>
                        )}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategoryFilters.length === 0 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategoryFilters([])}
                            className={`${selectedCategoryFilters.length === 0 ? "bg-blue-600 text-white" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                        >
                            Tất cả
                        </Button>
                        {danhmuc.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategoryFilters.includes(category.id.toString()) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleSupplier(category.id.toString())}
                                className={`${selectedCategoryFilters.includes(category.id.toString())
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {category.ten}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {suppliers.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                        <Building2 className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                            {suppliers.length > 0 ? "Không có Nhà Cung Cấp nào trong các danh mục này" : "Chưa có Nhà Cung Cấp nào được ghi nhận"}
                        </h3>
                        <p className="text-gray-500 text-sm md:text-base mb-4">
                            {suppliers.length > 0 ? "Hãy thử chọn danh mục khác hoặc bỏ bộ lọc" : "Thông tin Nhà Cung Cấp sẽ được lấy từ các Tài Sản đã tạo"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {suppliers.map((supplier) => {
                            return (
                                <div
                                    key={supplier.id}
                                    className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300"
                                >
                                    {/* 1. Tiêu đề chính của thẻ (Tên nhà cung cấp) */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">
                                        {supplier.ten}
                                    </h3>

                                    {/* 2. Nhóm các thông tin chi tiết */}
                                    <div className="space-y-2 text-sm flex-grow">
                                        <p className="text-gray-700">
                                            <span className="font-medium text-gray-600">Liên hệ: </span>
                                            {supplier.lienhe}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium text-gray-600">SĐT: </span>
                                            {supplier.sodienthoai}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium text-gray-600">Website: </span>
                                            {/* Biến website thành một link có thể nhấp vào */}
                                            <a
                                                href={supplier.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {supplier.website}
                                            </a>
                                        </p>
                                    </div>

                                    {/* 3. Phần "chân" của thẻ - Hiển thị thống kê và actions */}
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() => showAssetsBySupplier(supplier)}
                                                className="text-base font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer transition-colors"
                                                title="Click để xem danh sách tài sản"
                                            >
                                                {supplier.TaiSans?.length || 0} Tài Sản
                                            </button>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingSupplier(supplier);
                                                        setIsEditSupplierOpen(true);
                                                    }}
                                                    className="hover:bg-yellow-50 border-yellow-300"
                                                >
                                                    <Edit className="w-4 h-4 text-yellow-500" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteSupplier(supplier.id)}
                                                    className="hover:bg-red-50 border-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">
                                Thêm nhà cung cấp
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleAddSupplier} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ten" className="text-sm font-medium">
                                    Tên nhà cung cấp <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ten"
                                    name="ten"
                                    placeholder="Nhập tên nhà cung cấp"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    placeholder="https://example.com"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lienhe" className="text-sm font-medium">Liên hệ</Label>
                                <Input
                                    id="lienhe"
                                    name="lienhe"
                                    placeholder="Tên người liên hệ"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sodienthoai" className="text-sm font-medium">Số điện thoại</Label>
                                <Input
                                    id="sodienthoai"
                                    name="sodienthoai"
                                    placeholder="Số điện thoại"
                                    className="w-full"
                                />
                            </div>

                            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" className="w-full sm:w-auto">
                                    Lưu
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Supplier Modal */}
            {isEditSupplierOpen && editingSupplier && (
                <Dialog open={isEditSupplierOpen} onOpenChange={setIsEditSupplierOpen}>
                    <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">Sửa nhà cung cấp</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleEditSupplier} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-supplier-ten" className="text-sm font-medium">
                                    Tên nhà cung cấp <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-supplier-ten"
                                    name="ten"
                                    defaultValue={editingSupplier.ten}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-supplier-website" className="text-sm font-medium">Website</Label>
                                <Input
                                    id="edit-supplier-website"
                                    name="website"
                                    defaultValue={editingSupplier.website}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-supplier-lienhe" className="text-sm font-medium">Liên hệ</Label>
                                <Input
                                    id="edit-supplier-lienhe"
                                    name="lienhe"
                                    defaultValue={editingSupplier.lienhe}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-supplier-sodienthoai" className="text-sm font-medium">Số điện thoại</Label>
                                <Input
                                    id="edit-supplier-sodienthoai"
                                    name="sodienthoai"
                                    defaultValue={editingSupplier.sodienthoai}
                                    className="w-full"
                                />
                            </div>

                            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsEditSupplierOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600"
                                >
                                    Cập nhật
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal hiển thị tài sản theo nhà cung cấp */}
            {isAssetsBySupplierOpen && selectedSupplier && (
                <Dialog open={isAssetsBySupplierOpen} onOpenChange={setIsAssetsBySupplierOpen}>
                    <DialogContent className="sm:max-w-[800px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl flex items-center">
                                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                Tài sản của nhà cung cấp: {selectedSupplier.ten}
                            </DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Hiển thị {assetsBySupplier.length} tài sản
                            </p>
                        </DialogHeader>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {assetsBySupplier.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có tài sản nào
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Nhà cung cấp này chưa có tài sản nào được ghi nhận.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {assetsBySupplier.map((asset) => (
                                        <div
                                            key={asset.id}
                                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-900 line-clamp-2 flex items-center gap-2">
                                                    <Server className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                    {asset.ten_tai_san}
                                                </h4>
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-600">
                                                {asset.danh_muc_tai_san_ten && (
                                                    <p>
                                                        <span className="font-medium">Danh mục:</span> {asset.danh_muc_tai_san_ten}
                                                    </p>
                                                )}

                                                {asset.loai_tai_san_ten && (
                                                    <p>
                                                        <span className="font-medium">Loại:</span> {asset.loai_tai_san_ten}
                                                    </p>
                                                )}

                                                {/* Hiển thị thông tin chi tiết */}
                                                {asset.thong_tin && Object.keys(asset.thong_tin).length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                                        {Object.entries(asset.thong_tin)
                                                            .filter(([key, value]) => key !== 'null' && value !== null && value !== 'null' && value !== '')
                                                            .slice(0, 3) // Chỉ hiển thị 3 trường đầu tiên
                                                            .map(([key, value]) => (
                                                                <p key={key} className="text-xs">
                                                                    <span className="font-medium text-gray-900 capitalize">{key.replace('_', ' ')}:</span> {String(value)}
                                                                </p>
                                                            ))}
                                                    </div>
                                                )}

                                                {/* Hiển thị ngày tháng */}
                                                {(asset.ngay_dang_ky || asset.ngay_het_han) && (
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mt-2 pt-2 border-t border-gray-100">
                                                        {asset.ngay_dang_ky && (
                                                            <p>
                                                                <span className="font-medium">Đăng ký:</span><br />
                                                                {new Date(asset.ngay_dang_ky).toLocaleDateString('vi-VN')}
                                                            </p>
                                                        )}
                                                        {asset.ngay_het_han && (
                                                            <p>
                                                                <span className="font-medium">Hết hạn:</span><br />
                                                                {new Date(asset.ngay_het_han).toLocaleDateString('vi-VN')}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="pt-4 border-t mt-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsAssetsBySupplierOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Đóng
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}