import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink, Loader2, X, Building2, Mail, Link } from "lucide-react";
import { ThuongHieuStore } from "../../stores/thuonghieu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function BrandManagement() {
  const thuonghieu = ThuongHieuStore();
  const { data: brands, getAllThuongHieu, createThuongHieu, updateThuongHieu, deleteThuongHieu } = thuonghieu;
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllThuongHieu();
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handler thêm mới
  const handleAddBrand = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const newBrand = {
      ten: data.get("ten"),
      link: data.get("link"),
      lien_he: data.get("lien_he"),
    };
    try {
      await createThuongHieu(newBrand);
      setIsAddOpen(false);
      form.reset();
    } catch (err) {
      console.error("Failed to add brand:", err);
    }
  };

  // Handler sửa
  const handleEditBrand = async (e) => {
    e.preventDefault();
    if (!selectedBrand) return;

    const form = e.target;
    const data = new FormData(form);
    const updated = {
      ten: data.get("ten"),
      link: data.get("link"),
      lien_he: data.get("lien_he"),
    };

    try {
      await updateThuongHieu(selectedBrand.id, updated);
    } catch (err) {
      console.error("Failed to update brand:", err);
    } finally {
      setIsEditOpen(false);
      setSelectedBrand(null);
    }
  };

  // Handler xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục tài sản này không?")) {
      try {
        await deleteThuongHieu(id);
      } catch (err) {
        console.error("Failed to delete brand:", err);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header - Responsive */}
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
                Quản lý các danh mục và thương hiệu tài sản
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-600" />
            <span className="text-sm md:text-base font-medium text-gray-600">Đang tải dữ liệu...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && brands.length === 0 ? (
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
        /* Brand Grid - Responsive */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                  {brand.ten}
                </h3>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Website Link */}
                {brand.link && (
                  <div className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                        Website
                      </span>
                      <button
                        onClick={() => navigate(`/dashboard/quan-ly-danh-muc-tai-san/${brand.id}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all text-left"
                      >
                        {brand.link}
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Contact */}
                {brand.lien_he && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
                        Liên hệ
                      </span>
                      <a
                        href={`mailto:${brand.lien_he}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                      >
                        {brand.lien_he}
                      </a>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBrand(brand);
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
                    onClick={() => handleDelete(brand.id)}
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

      {/* Add Modal - Responsive */}
      {isAddOpen && (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Thêm danh mục tài sản</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddBrand} className="space-y-4">
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

      {/* Edit Modal - Responsive */}
      {isEditOpen && selectedBrand && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Sửa danh mục tài sản</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEditBrand} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ten" className="text-sm font-medium">
                  Tên danh mục tài sản <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-ten"
                  name="ten"
                  defaultValue={selectedBrand.ten}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-link" className="text-sm font-medium">Website</Label>
                <Input
                  id="edit-link"
                  name="link"
                  defaultValue={selectedBrand.link}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-lien_he" className="text-sm font-medium">Email liên hệ</Label>
                <Input
                  id="edit-lien_he"
                  name="lien_he"
                  type="email"
                  defaultValue={selectedBrand.lien_he}
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