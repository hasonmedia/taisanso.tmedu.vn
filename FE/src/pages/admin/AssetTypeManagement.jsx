import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Package, Building, Server, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LoaiTaiSanStore } from "../../stores/loaiTaiSan";
import AssetCategorySelectNew from "../../components/AssetCategorySelectNew";
import { ThuongHieuStore } from "../../stores/thuonghieu";

export default function AssetTypeManagement() {
    const { data: loaiTaiSans, getAllLoaiTaiSan, createLoaiTaiSan, updateLoaiTaiSan, deleteLoaiTaiSan } = LoaiTaiSanStore();
    const { data: categories } = ThuongHieuStore();
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditLoaiTaiSanOpen, setIsEditLoaiTaiSanOpen] = useState(false);
    const [editingLoaiTaiSan, setEditingLoaiTaiSan] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editSelectedCategory, setEditSelectedCategory] = useState("");

    const [isAssetsByTypeOpen, setIsAssetsByTypeOpen] = useState(false);
    const [selectedLoaiTaiSan, setSelectedLoaiTaiSan] = useState(null);

    // State mới để lọc
    const [filterCategory, setFilterCategory] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Bắt đầu loading mỗi khi fetch
            try {
                // Tạo đối tượng lọc
                const filterParams = filterCategory ? { danhMucTaiSanId: filterCategory } : {};
                await getAllLoaiTaiSan(filterParams);
            } catch (err) {
                console.error("Failed to fetch asset types:", err);
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        fetchData();
    }, [getAllLoaiTaiSan, filterCategory]); // Thêm filterCategory vào dependency array

    const handleAddLoaiTaiSan = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        const newLoaiTaiSan = {
            ten: data.get("ten"),
            danhMucTaiSanId: selectedCategory || null,
        };

        try {
            await createLoaiTaiSan(newLoaiTaiSan);
            setIsAddOpen(false);
            setSelectedCategory("");
            form.reset();
        } catch (error) {
            console.error("Failed to add loai tai san:", error);
            let errorMessage = "Có lỗi xảy ra khi thêm loại tài sản";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
    };

    const handleEditLoaiTaiSan = async (e) => {
        e.preventDefault();
        if (!editingLoaiTaiSan) return;

        const form = e.target;
        const data = new FormData(form);
        const updated = {
            ten: data.get("ten"),
            danhMucTaiSanId: editSelectedCategory || null,
        };

        try {
            await updateLoaiTaiSan(editingLoaiTaiSan.id, updated);
        } catch (error) {
            console.error("Failed to update loai tai san:", error);
            let errorMessage = "Có lỗi xảy ra khi cập nhật loại tài sản";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        } finally {
            setIsEditLoaiTaiSanOpen(false);
            setEditingLoaiTaiSan(null);
            setEditSelectedCategory("");
        }
    };

    const handleDeleteLoaiTaiSan = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa loại tài sản này không?")) {
            try {
                await deleteLoaiTaiSan(id);
            } catch (error) {
                console.error("Failed to delete loai tai san:", error);
                let errorMessage = "Có lỗi xảy ra khi xóa loại tài sản";
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                alert(errorMessage);
            }
        }
    };

    const openEditLoaiTaiSanModal = (loaiTaiSan) => {
        setEditingLoaiTaiSan(loaiTaiSan);
        setEditSelectedCategory(loaiTaiSan.DanhMucTaiSanId ? loaiTaiSan.DanhMucTaiSanId.toString() : "");
        setIsEditLoaiTaiSanOpen(true);
    };

    const showAssetsByType = async (loaiTaiSan) => {
        try {
            setSelectedLoaiTaiSan(loaiTaiSan);
            setIsAssetsByTypeOpen(true);
        } catch (error) {
            console.error('Error fetching assets by type:', error);
        }
    };

    // Không hiển thị loading nữa vì nó được xử lý trong useEffect
    // if (loading) { ... } // Gỡ bỏ hoặc điều chỉnh nếu cần thiết cho lần tải đầu tiên

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

            {/* Thanh Lọc Mới */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 md:mb-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="flex-1 min-w-0">
                        <Label htmlFor="filter-category" className="text-sm font-medium text-gray-700">
                            Lọc theo danh mục tài sản
                        </Label>
                        <AssetCategorySelectNew
                            value={filterCategory}
                            onValueChange={setFilterCategory}
                            placeholder="Tất cả danh mục" // Placeholder này sẽ có giá trị ""
                        />
                    </div>
                    {filterCategory && (
                        <Button
                            variant="ghost"
                            onClick={() => setFilterCategory("")}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <FilterX className="w-4 h-4 mr-2" />
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-600" />
                            <span className="text-sm md:text-base font-medium text-gray-600">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                ) : loaiTaiSans.length === 0 ? (
                    <div className="text-center py-8 md:py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                            {filterCategory ? "Không tìm thấy loại tài sản" : "Chưa có loại tài sản nào"}
                        </h3>
                        <p className="text-gray-500 text-sm md:text-base mb-4">
                            {filterCategory
                                ? "Không có loại tài sản nào phù hợp với bộ lọc của bạn."
                                : "Bắt đầu bằng cách thêm loại tài sản đầu tiên."
                            }
                        </p>
                        {!filterCategory && (
                            <Button onClick={() => setIsAddOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm loại tài sản đầu tiên
                            </Button>
                        )}
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
                                    {loaiTaiSan.DanhMucTaiSan?.ten && (
                                        <p className="text-sm font-bold text-blue-600 group-hover:text-blue-700 mt-1">
                                            {loaiTaiSan.DanhMucTaiSan?.ten}
                                        </p>
                                    )}
                                </div>

                                <div className="p-4 space-y-3">
                                    {loaiTaiSan.DanhMucTaiSan && (
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-600">Danh mục: </span>
                                            <span className="text-gray-800">{loaiTaiSan.DanhMucTaiSan.ten}</span>
                                        </div>
                                    )}

                                    <div className="text-sm">
                                        <span className="font-medium text-gray-600">Số tài sản: </span>
                                        <span className="text-gray-800">{loaiTaiSan.TaiSans?.length || 0}</span>
                                    </div>

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
                                <Label className="text-sm font-medium">Danh mục tài sản</Label>
                                <AssetCategorySelectNew
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    placeholder="Chọn danh mục tài sản"
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
                                <Label className="text-sm font-medium">Danh mục tài sản</Label>
                                <AssetCategorySelectNew
                                    value={editSelectedCategory}
                                    onValueChange={setEditSelectedCategory}
                                    placeholder="Chọn danh mục tài sản"
                                />
                            </div>

                            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setIsEditLoaiTaiSanOpen(false);
                                        setEditingLoaiTaiSan(null);
                                        setEditSelectedCategory("");
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
                                {selectedLoaiTaiSan.DanhMucTaiSan
                                    ? `Thuộc danh mục: ${selectedLoaiTaiSan.DanhMucTaiSan.ten}`
                                    : "Không thuộc danh mục nào"
                                }
                            </p>
                        </DialogHeader>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                            {!selectedLoaiTaiSan.TaiSans || selectedLoaiTaiSan.TaiSans?.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có tài sản nào
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Chưa có tài sản nào thuộc loại này.
                                    </p>
                                </div>
                            ) : (
                                <Accordion type="multiple" className="w-full">
                                    {selectedLoaiTaiSan.TaiSans.map((taiSan) => (
                                        <AccordionItem value={`supplier-${taiSan.id}`} key={taiSan.id}>
                                            <AccordionTrigger className="font-semibold text-base hover:no-underline rounded-lg px-3 -ml-3 hover:bg-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Server className="w-4 h-4 text-gray-700" />
                                                    <span>{taiSan.ten_tai_san}</span>
                                                    {/* Bạn có thể thêm các thông tin khác của tài sản ở đây */}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pl-6 pt-2 pb-4 border-l-2 border-blue-100 ml-3">
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    <p><strong>Mã tài sản:</strong> {taiSan.ma_tai_san}</p>
                                                    <p><strong>Trạng thái:</strong> {taiSan.TrangThaiTaiSan?.ten}</p>
                                                    {/* Thêm các chi tiết tài sản khác nếu bạn muốn */}
                                                </div>
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
            )
            }
        </div >
    );
}