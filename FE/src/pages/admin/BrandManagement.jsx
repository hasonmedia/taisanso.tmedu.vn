import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink, Loader2, X, Building2, Mail, Link, Box, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { ThuongHieuStore } from "../../stores/thuonghieu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function AssetCategoryManagement() {
  const danhMucTaiSanStore = ThuongHieuStore();
  // Đổi tên data: brands thành data: categories để rõ nghĩa
  const { data: categories, getAllThuongHieu, createThuongHieu, updateThuongHieu, deleteThuongHieu } = danhMucTaiSanStore;

  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Đổi tên để tránh conflict
  const navigate = useNavigate();

  // *******************************
  // BỔ SUNG STATE CHO TAB, FILTER VÀ VIEW
  const [activeTab, setActiveTab] = useState("categories"); // 'categories' hoặc 'providers'
  const [selectedProviders, setSelectedProviders] = useState([]); // Lọc theo NCC (multiple)
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]); // Lọc theo Danh mục (multiple)
  const [viewMode, setViewMode] = useState("default"); // 'default' hoặc 'providerAssets'
  const [currentProviderAssets, setCurrentProviderAssets] = useState([]);
  const [currentProviderName, setCurrentProviderName] = useState("");
  // *******************************

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Giả sử getAllThuongHieu trả về danh sách Danh mục tài sản (Categories)
        await getAllThuongHieu();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handler thêm mới (Giữ nguyên, đổi tên biến)
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

  // Handler sửa (Giữ nguyên, đổi tên biến)
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

  // Handler xóa (Giữ nguyên)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục tài sản này không?")) {
      try {
        await deleteThuongHieu(id);
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  };

  // Helper function để tính toán thống kê tài sản
  const calculateAssetStatistics = (assets) => {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    let total = assets.length;
    let expiringSoon = 0;
    let expired = 0;

    assets.forEach(asset => {
      if (asset.ngay_het_han) {
        const expiryDate = new Date(asset.ngay_het_han);

        if (expiryDate < currentDate) {
          expired++;
        } else if (expiryDate <= thirtyDaysFromNow) {
          expiringSoon++;
        }
      }
    });

    return {
      total,
      expiringSoon,
      expired
    };
  };

  // 1. Trích xuất danh sách duy nhất các Nhà Cung Cấp từ TẤT CẢ Tài Sản
  const getUniqueProviders = () => {
    const allProviders = categories.flatMap(category =>
      category.TaiSans
        .map(asset => asset.ten_nha_cung_cap)
        .filter(name => name && name !== "không có thông tin")
    );
    return [...new Set(allProviders)];
  };

  // 2. Trích xuất danh sách duy nhất các Danh mục
  const getUniqueCategories = () => {
    return categories.map(category => ({
      id: category.id,
      ten: category.ten
    }));
  };

  // 3. Hàm lọc chính cho Tab Danh mục Tài sản (lọc theo NCC)
  const filteredCategories = categories.map(category => {
    const filteredAssets = category.TaiSans.filter(asset => {
      // Lọc theo Nhà Cung Cấp (multiple selection)
      const matchesProvider = selectedProviders.length === 0 ||
        selectedProviders.includes(asset.ten_nha_cung_cap);
      return matchesProvider;
    });

    // Tính toán thống kê cho danh mục
    const statistics = calculateAssetStatistics(filteredAssets);

    return {
      ...category,
      TaiSans: filteredAssets,
      totalAssets: filteredAssets.length,
      statistics
    };
  }).filter(category => category.totalAssets > 0 || selectedProviders.length === 0);

  // 4. Hàm lọc chính cho Tab Nhà cung cấp (lọc theo Danh mục)
  const filteredProviders = () => {
    const uniqueProviders = getUniqueProviders();

    if (selectedCategoryFilters.length === 0) {
      return uniqueProviders;
    }

    // Lọc NCC theo các danh mục được chọn (multiple selection)
    const selectedCategoryIds = selectedCategoryFilters.map(id => parseInt(id));
    const selectedCategories = categories.filter(cat => selectedCategoryIds.includes(cat.id));

    const providersInSelectedCategories = selectedCategories.flatMap(categoryData =>
      categoryData.TaiSans
        .map(asset => asset.ten_nha_cung_cap)
        .filter(name => name && name !== "không có thông tin")
    );

    return [...new Set(providersInSelectedCategories)];
  };

  const uniqueProviders = getUniqueProviders();
  const uniqueCategories = getUniqueCategories();

  const handleViewProviderAssets = (providerName) => {
    const allAssets = categories.flatMap(c => c.TaiSans);
    const assetsByProvider = allAssets.filter(asset => asset.ten_nha_cung_cap === providerName);

    setCurrentProviderName(providerName);
    setCurrentProviderAssets(assetsByProvider);
    setViewMode("providerAssets");
  };

  const handleBackToDefaultView = () => {
    setViewMode("default");
    setCurrentProviderAssets([]);
    setCurrentProviderName("");
  };

  // Hiển thị loading state
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

  // *******************************
  // HIỂN THỊ CHẾ ĐỘ XEM TÀI SẢN THEO NCC
  // *******************************
  if (viewMode === "providerAssets") {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-6 shadow-lg border border-gray-200">
          <button
            onClick={handleBackToDefaultView}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4 text-sm font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            Quay lại Quản lý
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="w-6 h-6 mr-3 text-blue-600" />
            Tài Sản của Nhà Cung Cấp: <span className="text-blue-600 ml-2">{currentProviderName}</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng cộng {currentProviderAssets.length} tài sản được tìm thấy.
          </p>
        </div>

        {currentProviderAssets.length === 0 ? (
          <div className="text-center py-10">
            <Box className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Không có tài sản nào cho nhà cung cấp này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProviderAssets.map(asset => (
              <div key={asset.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {asset.ten_tai_san}
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  Danh mục: {categories.find(c => c.id === asset.DanhMucTaiSanId)?.ten || "Không rõ"}
                </p>
                <div className="space-y-1 text-sm text-gray-700">
                  {asset.thong_tin?.website && (
                    <p className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2 text-blue-500" />
                      Website: <a href={asset.thong_tin.website} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline truncate">{asset.thong_tin.website}</a>
                    </p>
                  )}
                  {asset.ngay_het_han && (
                    <p className="flex items-center">
                      <Box className="w-4 h-4 mr-2 text-red-500" />
                      Hết hạn: <span className="font-medium ml-1 text-red-600">{asset.ngay_het_han}</span>
                    </p>
                  )}
                  {/* Thêm các thông tin khác của tài sản nếu cần */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header (Giữ nguyên) */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 md:p-6 mb-4 md:mb-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
              <Building2 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                Quản Lý Danh Mục & Nhà Cung Cấp
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Quản lý các danh mục tài sản và nhà cung cấp
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

      {/* --- Tab Switcher --- */}
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab("categories");
            setSelectedCategoryFilters([]); // Reset filter khi đổi tab
          }}
          className={`pb-2 px-3 text-sm font-medium transition-colors duration-200 ${activeTab === "categories"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Danh Mục Tài Sản
        </button>
        <button
          onClick={() => {
            setActiveTab("providers");
            setSelectedProviders([]); // Reset filter khi đổi tab
          }}
          className={`pb-2 px-3 text-sm font-medium transition-colors duration-200 ${activeTab === "providers"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Danh Mục Nhà Cung Cấp
        </button>
      </div>

      {/* --- Bộ Lọc cho Tab Danh Mục Tài Sản (Lọc theo NCC) --- */}
      {activeTab === "categories" && uniqueProviders.length > 0 && (
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
              onClick={() => setSelectedProviders([])}
              className={`${selectedProviders.length === 0 ? "bg-blue-600 text-white" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              Tất cả
            </Button>
            {uniqueProviders.map((provider) => (
              <Button
                key={provider}
                variant={selectedProviders.includes(provider) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (selectedProviders.includes(provider)) {
                    setSelectedProviders(selectedProviders.filter(p => p !== provider));
                  } else {
                    setSelectedProviders([...selectedProviders, provider]);
                  }
                }}
                className={`${selectedProviders.includes(provider)
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {provider}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* --- Bộ Lọc cho Tab Nhà Cung Cấp (Lọc theo Danh Mục) --- */}
      {activeTab === "providers" && uniqueCategories.length > 0 && (
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
            {uniqueCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryFilters.includes(category.id.toString()) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const categoryIdStr = category.id.toString();
                  if (selectedCategoryFilters.includes(categoryIdStr)) {
                    setSelectedCategoryFilters(selectedCategoryFilters.filter(id => id !== categoryIdStr));
                  } else {
                    setSelectedCategoryFilters([...selectedCategoryFilters, categoryIdStr]);
                  }
                }}
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
      <>
        {/* TAB 1: DANH MỤC TÀI SẢN */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {selectedProviders.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 flex items-center justify-between rounded-md" role="alert">
                <p className="font-bold">
                  Đang lọc theo {selectedProviders.length} NCC: {selectedProviders.join(", ")}
                </p>
                <Button onClick={() => setSelectedProviders([])} variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            {/* Empty State cho Danh Mục */}
            {categories.length === 0 ? (
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
              /* Danh mục Grid - Dùng filteredCategories */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                        {category.ten}
                      </h3>

                      {/* Thống kê tài sản */}
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 rounded p-2">
                          <div className="text-lg font-bold text-blue-600">{category.statistics.total}</div>
                          <div className="text-xs text-blue-700">Tổng số</div>
                        </div>

                        <div className="bg-orange-50 rounded p-2">
                          <div className="text-lg font-bold text-orange-600">{category.statistics.expiringSoon}</div>
                          <div className="text-xs text-orange-700">Sắp hết hạn</div>
                        </div>

                        <div className="bg-red-50 rounded p-2">
                          <div className="text-lg font-bold text-red-600">{category.statistics.expired}</div>
                          <div className="text-xs text-red-700">Đã hết hạn</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      {/* View Details Button */}
                      <Button
                        onClick={() => {
                          navigate(`/dashboard/quan-ly-danh-muc-tai-san/${category.id}`);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Xem chi tiết ({category.statistics.total} tài sản)
                      </Button>

                      {/* Action Buttons */}
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
        )}

        {/* TAB 2: DANH MỤC NHÀ CUNG CẤP */}
        {activeTab === "providers" && (
          <div className="space-y-6">
            {selectedCategoryFilters.length > 0 && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-center justify-between rounded-md" role="alert">
                <p className="font-bold">
                  Đang lọc theo {selectedCategoryFilters.length} danh mục: {
                    selectedCategoryFilters.map(id =>
                      uniqueCategories.find(cat => cat.id.toString() === id)?.ten
                    ).join(", ")
                  }
                </p>
                <Button onClick={() => setSelectedCategoryFilters([])} variant="ghost" size="sm" className="text-green-700 hover:bg-green-100">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            {filteredProviders().length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Building2 className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                  {selectedCategoryFilters.length > 0 ? "Không có Nhà Cung Cấp nào trong các danh mục này" : "Chưa có Nhà Cung Cấp nào được ghi nhận"}
                </h3>
                <p className="text-gray-500 text-sm md:text-base mb-4">
                  {selectedCategoryFilters.length > 0 ? "Hãy thử chọn danh mục khác hoặc bỏ bộ lọc" : "Thông tin Nhà Cung Cấp sẽ được lấy từ các Tài Sản đã tạo"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProviders().map((providerName) => {
                  const allAssets = categories.flatMap(c => c.TaiSans);
                  const providerAssets = allAssets.filter(a => a.ten_nha_cung_cap === providerName);

                  // Nếu có filter theo danh mục, chỉ đếm assets trong các danh mục đó
                  const assetsCount = selectedCategoryFilters.length > 0
                    ? categories.filter(cat => selectedCategoryFilters.includes(cat.id.toString()))
                      .flatMap(cat => cat.TaiSans)
                      .filter(asset => asset.ten_nha_cung_cap === providerName).length
                    : providerAssets.length;

                  return (
                    <div key={providerName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                        {providerName}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Box className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                          {selectedCategoryFilters.length > 0 ? "Tài sản trong các danh mục đã chọn" : "Tổng tài sản"}:
                          <span className="font-semibold ml-1">{assetsCount}</span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleViewProviderAssets(providerName)}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Xem Tài Sản ({providerAssets.length})
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </>

      {/* Add Modal (Giữ nguyên, đổi tên biến) */}
      {isAddOpen && (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Thêm danh mục tài sản</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddCategory} className="space-y-4">
              {/* ... form fields (Giữ nguyên) */}
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

      {/* Edit Modal (Giữ nguyên, đổi tên biến) */}
      {isEditOpen && editingCategory && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px] mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Sửa danh mục tài sản</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEditCategory} className="space-y-4">
              {/* ... form fields (Giữ nguyên) */}
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