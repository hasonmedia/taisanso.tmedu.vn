import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Building2 } from "lucide-react";
import { ThuongHieuStore } from "../../stores/thuonghieu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { AssetStore } from "../../stores/asset";
import { SupplierStore } from "../../stores/supplier";

export default function CategoryManagement() {
    const { detailedInfo: danhmuc, getAssetsDetailedInfo } = AssetStore();
    const { data: categories, createThuongHieu, updateThuongHieu, deleteThuongHieu } = ThuongHieuStore();
    const { data: suppliers, getSuppliers } = SupplierStore();
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const navigate = useNavigate();
    const [selectedProviders, setSelectedProviders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getSuppliers();
                await getAssetsDetailedInfo();
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAssetsDetailedInfo(selectedProviders);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedProviders]);

    const toggleProvider = (providerId) => {
        setSelectedProviders((prevIds) => {
            if (prevIds.includes(providerId)) {
                return prevIds.filter(id => id !== providerId);
            } else {
                return [...prevIds, providerId];
            }
        });
    };

    const selectAllProviders = () => {
        setSelectedProviders([]);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        const newCategory = {
            ten: data.get("ten"),
            link: data.get("link"),
            lien_he: data.get("lien_he"),
        };
        try {
            await createThuongHieu(newCategory);
            setIsAddOpen(false);
            form.reset();
        } catch (err) {
            console.error("Failed to add category:", err);
        }
    };

    const handleEditCategory = async (e) => {
        e.preventDefault();
        if (!editingCategory) return;

        const form = e.target;
        const data = new FormData(form);
        const updated = {
            ten: data.get("ten"),
            link: data.get("link"),
            lien_he: data.get("lien_he"),
        };

        try {
            await updateThuongHieu(editingCategory.id, updated);
        } catch (err) {
            console.error("Failed to update category:", err);
        } finally {
            setIsEditOpen(false);
            setEditingCategory(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục tài sản này không?")) {
            try {
                await deleteThuongHieu(id);
            } catch (err) {
                console.error("Failed to delete category:", err);
            }
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
                            <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                                Quản Lý Danh Mục Tài Sản
                            </h1>
                            <p className="text-blue-100 text-sm md:text-base mt-1">
                                Quản lý các danh mục tài sản
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            {suppliers.length > 0 && (
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                        Lọc theo Nhà Cung Cấp
                        {selectedProviders.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {selectedProviders.length} đã chọn
                            </span>
                        )}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedProviders.length === 0 ? "default" : "outline"}
                            size="sm"
                            onClick={selectAllProviders}
                            className={`${selectedProviders.length === 0 ? "bg-blue-600 text-white" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                        >
                            Tất cả
                        </Button>
                        {suppliers.map((provider) => {
                            const isSelected = selectedProviders.includes(provider.id);
                            return (
                                <Button
                                    key={provider.id}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleProvider(provider.id)}
                                    className={`${isSelected
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {provider.ten}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {danhmuc.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                        <Building2 className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                            Chưa có danh mục tài sản nào
                        </h3>
                        <p className="text-gray-500 text-sm md:text-base mb-4">
                            Bắt đầu bằng cách thêm danh mục tài sản đầu tiên
                        </p>
                        <Button onClick={() => setIsAddOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm danh mục đầu tiên
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {danhmuc.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                                        {category.ten}
                                    </h3>

                                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                        <button
                                            onClick={() => navigate(`/dashboard/quan-ly-danh-muc-tai-san/${category.id}`)}
                                            className="bg-blue-50 rounded p-2 hover:bg-blue-100 transition-colors cursor-pointer group"
                                        >
                                            <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700">{category.TaiSans.length}</div>
                                            <div className="text-xs text-blue-700 group-hover:text-blue-800">Tổng số</div>
                                        </button>

                                        <button
                                            onClick={() => navigate(`/dashboard/quan-ly-danh-muc-tai-san/${category.id}?status=upcoming`)}
                                            className="bg-orange-50 rounded p-2 hover:bg-orange-100 transition-colors cursor-pointer group"
                                        >
                                            <div className="text-lg font-bold text-orange-600 group-hover:text-orange-700">{category.so_luong_sap_het_han}</div>
                                            <div className="text-xs text-orange-700 group-hover:text-orange-800">Sắp hết hạn</div>
                                        </button>

                                        <button
                                            onClick={() => navigate(`/dashboard/quan-ly-danh-muc-tai-san/${category.id}?status=expired`)}
                                            className="bg-red-50 rounded p-2 hover:bg-red-100 transition-colors cursor-pointer group"
                                        >
                                            <div className="text-lg font-bold text-red-600 group-hover:text-red-700">{category.so_luong_het_han}</div>
                                            <div className="text-xs text-red-700 group-hover:text-red-800">Đã hết hạn</div>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setIsEditOpen(true);
                                            }}
                                            className="flex-1 hover:bg-yellow-50 border-yellow-300"
                                        >
                                            <Edit className="w-4 h-4 text-yellow-500 mr-1" />
                                            <span className="hidden sm:inline">Sửa</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(category.id)}
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
                                Thêm danh mục tài sản
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ten" className="text-sm font-medium">
                                    Tên danh mục tài sản <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ten"
                                    name="ten"
                                    placeholder="Nhập tên danh mục tài sản"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link" className="text-sm font-medium">Website</Label>
                                <Input
                                    id="link"
                                    name="link"
                                    placeholder="https://example.com"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lien_he" className="text-sm font-medium">Email liên hệ</Label>
                                <Input
                                    id="lien_he"
                                    name="lien_he"
                                    type="email"
                                    placeholder="email@example.com"
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

            {/* Edit Modal */}
            {isEditOpen && editingCategory && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">Sửa danh mục tài sản</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleEditCategory} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-ten" className="text-sm font-medium">
                                    Tên danh mục tài sản <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-ten"
                                    name="ten"
                                    defaultValue={editingCategory.ten}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-link" className="text-sm font-medium">Website</Label>
                                <Input
                                    id="edit-link"
                                    name="link"
                                    defaultValue={editingCategory.link}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-lien_he" className="text-sm font-medium">Email liên hệ</Label>
                                <Input
                                    id="edit-lien_he"
                                    name="lien_he"
                                    type="email"
                                    defaultValue={editingCategory.lien_he}
                                    className="w-full"
                                />
                            </div>

                            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
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
        </div>
    );
}