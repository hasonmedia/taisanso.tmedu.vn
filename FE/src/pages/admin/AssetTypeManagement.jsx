import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Package, Building, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AssetStore } from "../../stores/asset";
import { LoaiTaiSanStore } from "../../stores/loaiTaiSan";
import SupplierSelect from "../../components/SupplierSelect";

export default function AssetTypeManagement() {
    const { data: loaiTaiSans, getAllLoaiTaiSan, createLoaiTaiSan, updateLoaiTaiSan, deleteLoaiTaiSan } = LoaiTaiSanStore();
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditLoaiTaiSanOpen, setIsEditLoaiTaiSanOpen] = useState(false);
    const [editingLoaiTaiSan, setEditingLoaiTaiSan] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [editSelectedSupplier, setEditSelectedSupplier] = useState("");

    const [isAssetsByTypeOpen, setIsAssetsByTypeOpen] = useState(false);
    const [selectedLoaiTaiSan, setSelectedLoaiTaiSan] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAllLoaiTaiSan();
            } catch (err) {
                console.error("Failed to fetch asset types:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddLoaiTaiSan = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        const newLoaiTaiSan = {
            ten: data.get("ten"),
            nhaCungCapId: selectedSupplier || null,
        };

        try {
            await createLoaiTaiSan(newLoaiTaiSan);
            setIsAddOpen(false);
            setSelectedSupplier("");
            form.reset();
        } catch (error) {
            console.error("Failed to add loai tai san:", error);
        }
    };

    const handleEditLoaiTaiSan = async (e) => {
        e.preventDefault();
        if (!editingLoaiTaiSan) return;

        const form = e.target;
        const data = new FormData(form);
        const updated = {
            ten: data.get("ten"),
            nhaCungCapId: editSelectedSupplier || null,
        };

        try {
            await updateLoaiTaiSan(editingLoaiTaiSan.id, updated);
        } catch (error) {
            console.error("Failed to update loai tai san:", error);
        } finally {
            setIsEditLoaiTaiSanOpen(false);
            setEditingLoaiTaiSan(null);
            setEditSelectedSupplier("");
        }
    };

    const handleDeleteLoaiTaiSan = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa loại tài sản này không?")) {
            try {
                await deleteLoaiTaiSan(id);
            } catch (error) {
                console.error("Failed to delete loai tai san:", error);
            }
        }
    };

    const openEditLoaiTaiSanModal = (loaiTaiSan) => {
        setEditingLoaiTaiSan(loaiTaiSan);
        setEditSelectedSupplier(loaiTaiSan.NhaCungCapId ? loaiTaiSan.NhaCungCapId.toString() : "");
        setIsEditLoaiTaiSanOpen(true);
    };

    // Function để hiển thị tài sản theo loại
    const showAssetsByType = async (loaiTaiSan) => {
        try {
            setSelectedLoaiTaiSan(loaiTaiSan);
            setIsAssetsByTypeOpen(true);

            // setAssetsByType(filteredAssets);
        } catch (error) {
            console.error('Error fetching assets by type:', error);
            // setAssetsByType([]);
        }
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
                            <Package className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                                Quản Lý Loại Tài Sản
                            </h1>
                            <p className="text-blue-100 text-sm md:text-base mt-1">
                                Quản lý các loại tài sản
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm loại tài sản
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {loaiTaiSans.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                        <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                            Chưa có loại tài sản nào
                        </h3>
                        <p className="text-gray-500 text-sm md:text-base mb-4">
                            Bắt đầu bằng cách thêm loại tài sản đầu tiên
                        </p>
                        <Button onClick={() => setIsAddOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm loại tài sản đầu tiên
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {loaiTaiSans.map((loaiTaiSan) => (
                            <div
                                key={loaiTaiSan.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden hover:border-blue-300"
                            >
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                                    <h3
                                        className="text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => showAssetsByType(loaiTaiSan)}
                                        title="Click để xem tài sản thuộc loại này"
                                    >
                                        {loaiTaiSan.ten}
                                    </h3>
                                    <p className="text-sm font-bold text-blue-600 group-hover:text-blue-700">{loaiTaiSan.nhaCungCaps.length} nhà cung cấp</p>
                                </div>

                                <div className="p-4 space-y-3">
                                    {loaiTaiSan.NhaCungCap && (
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-600">Nhà cung cấp: </span>
                                            <span className="text-gray-800">{loaiTaiSan.NhaCungCap.ten_nha_cung_cap || loaiTaiSan.NhaCungCap.ten}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditLoaiTaiSanModal(loaiTaiSan)}
                                            className="flex-1 hover:bg-yellow-50 border-yellow-300"
                                        >
                                            <Edit className="w-4 h-4 text-yellow-500 mr-1" />
                                            <span className="hidden sm:inline">Sửa</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteLoaiTaiSan(loaiTaiSan.id)}
                                            className="flex-1 hover:bg-red-50 border-red-300"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500 mr-1" />
                                            <span className="hidden sm:inline">Xóa</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">
                                Thêm loại tài sản
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleAddLoaiTaiSan} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ten" className="text-sm font-medium">
                                    Tên loại tài sản <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ten"
                                    name="ten"
                                    placeholder="Nhập tên loại tài sản"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Nhà cung cấp</Label>
                                <SupplierSelect
                                    value={selectedSupplier}
                                    onValueChange={setSelectedSupplier}
                                    placeholder="Chọn nhà cung cấp (tùy chọn)"
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

            {/* Edit Loai Tai San Modal */}
            {isEditLoaiTaiSanOpen && editingLoaiTaiSan && (
                <Dialog open={isEditLoaiTaiSanOpen} onOpenChange={setIsEditLoaiTaiSanOpen}>
                    <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">Sửa loại tài sản</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleEditLoaiTaiSan} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-ten" className="text-sm font-medium">
                                    Tên loại tài sản <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-ten"
                                    name="ten"
                                    defaultValue={editingLoaiTaiSan.ten}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Nhà cung cấp</Label>
                                <SupplierSelect
                                    value={editSelectedSupplier}
                                    onValueChange={setEditSelectedSupplier}
                                    placeholder="Chọn nhà cung cấp (tùy chọn)"
                                />
                            </div>

                            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setIsEditLoaiTaiSanOpen(false);
                                        setEditingLoaiTaiSan(null);
                                        setEditSelectedSupplier("");
                                    }}
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

            {/* Modal hiển thị tài sản theo loại */}
            {isAssetsByTypeOpen && selectedLoaiTaiSan && (
                <Dialog open={isAssetsByTypeOpen} onOpenChange={setIsAssetsByTypeOpen}>
                    <DialogContent className="sm:max-w-[800px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-600" />
                                Tài sản thuộc loại: {selectedLoaiTaiSan.ten}
                            </DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedLoaiTaiSan.nhaCungCaps && selectedLoaiTaiSan.nhaCungCaps.length > 0
                                    ? `Tìm thấy tài sản từ ${selectedLoaiTaiSan.nhaCungCaps.length} nhà cung cấp`
                                    : "Chưa có tài sản nào thuộc loại này"
                                }
                            </p>
                        </DialogHeader>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {!selectedLoaiTaiSan.nhaCungCaps || selectedLoaiTaiSan.nhaCungCaps.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có tài sản nào
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Chưa có tài sản nào thuộc loại này hoặc chưa được gán nhà cung cấp.
                                    </p>
                                </div>
                            ) : (
                                <Accordion type="multiple" className="w-full">
                                    {selectedLoaiTaiSan.nhaCungCaps.map((supplier) => (
                                        <AccordionItem value={`supplier-${supplier.id}`} key={supplier.id}>
                                            <AccordionTrigger className="font-semibold text-base hover:no-underline rounded-lg px-3 -ml-3 hover:bg-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-4 h-4 text-gray-700" />
                                                    <span>{supplier.ten}</span>
                                                    <span className="text-xs font-normal bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                        {supplier.taiSans?.length || 0} tài sản
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-2 pb-0 pl-6">
                                                {(!supplier.taiSans || supplier.taiSans.length === 0) ? (
                                                    <p className="text-gray-500 text-sm py-4 text-center">
                                                        Không có tài sản nào cho nhà cung cấp này.
                                                    </p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {supplier.taiSans.map((asset) => (
                                                            <div
                                                                key={asset.id}
                                                                className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow mr-3"
                                                            >
                                                                <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                                                    <Server className="w-4 h-4 text-blue-600" />
                                                                    {asset.ten_tai_san}
                                                                </h4>

                                                                {/* Hiển thị thông tin chi tiết */}
                                                                {asset.thong_tin && Object.keys(asset.thong_tin).length > 0 && (
                                                                    <div className="space-y-1 text-xs text-gray-700 mt-2 pt-2 border-t border-gray-100">
                                                                        {Object.entries(asset.thong_tin)
                                                                            .filter(([key, value]) => key !== 'null' && value !== null && value !== 'null' && value !== '')
                                                                            .map(([key, value]) => (
                                                                                <p key={key}>
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
                                                        ))}
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </div>

                        <DialogFooter className="pt-4 border-t mt-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsAssetsByTypeOpen(false)}
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