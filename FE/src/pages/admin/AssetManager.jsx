import { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Package, Filter, Info, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import AssetModal from "../../components/AssetModal";
import EditAssetModal from "../../components/EditAssetModal";
import ViewAssetModal from "../../components/ViewAssetModal";
import { AssetStore } from "../../stores/asset";
import { ThuongHieuStore } from "../../stores/thuonghieu";
import { SupplierStore } from "../../stores/supplier";
import { LoaiTaiSanStore } from "../../stores/loaiTaiSan";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import PaginationControls from "../../components/PaginationControls";
export default function AssetManager() {
  // Get state from Zustand stores
  const {
    data: assets,
    getAllAsset,
    deleteAsset,
    pagination,
    loading: assetLoading,
  } = AssetStore();
  const { data: categories, getAllThuongHieu } = ThuongHieuStore();
  const { data: suppliers, getSuppliers } = SupplierStore();
  const { data: assetTypes, getAllLoaiTaiSan } = LoaiTaiSanStore();

  // Local state for filters and pagination
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedAssetTypeId, setSelectedAssetTypeId] = useState("all");
  const [selectedSupplierId, setSelectedSupplierId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Default limit, matches store

  // State for modals and UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch initial data once on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          getAllThuongHieu(),
          getSuppliers(),
        ]);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu khởi tạo:", err);
      }
    };
    fetchInitialData();
  }, [getAllThuongHieu, getSuppliers]);

  // Fetch asset types when category changes
  useEffect(() => {
    const fetchAssetTypes = async () => {
      if (selectedCategoryId !== "all") {
        try {
          await getAllLoaiTaiSan({ danhMucTaiSanId: selectedCategoryId });
        } catch (err) {
          console.error("Lỗi khi tải loại tài sản:", err);
        }
      } else {
        await getAllLoaiTaiSan();
      }
    };
    fetchAssetTypes();
  }, [selectedCategoryId, getAllLoaiTaiSan]);

  // Fetch assets whenever filters, pagination, or modal states change
  useEffect(() => {
    const fetchData = async () => {
      // Only fetch if modals are closed
      if (!isAddModalOpen && !isEditModalOpen) {
        try {
          const filters = {
            page: currentPage,
            limit: limit,
            search: searchTerm || null,
            idDanhMucTaiSan: selectedCategoryId === "all" ? null : parseInt(selectedCategoryId),
            idLoaiTaiSan: selectedAssetTypeId === "all" ? null : parseInt(selectedAssetTypeId),
            idNhaCungCap: selectedSupplierId === "all" ? null : parseInt(selectedSupplierId),
          };

          await getAllAsset(filters);
        } catch (err) {
          console.error("Lỗi khi tải tài sản:", err);
          toast.error("Lỗi khi tải dữ liệu tài sản");
        }
      }
    };
    fetchData();
  }, [
    getAllAsset,
    currentPage,
    limit,
    searchTerm,
    selectedCategoryId,
    selectedAssetTypeId,
    selectedSupplierId,
    isAddModalOpen,
    isEditModalOpen,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryId, selectedAssetTypeId, selectedSupplierId, limit]);

  // Reset asset type and supplier when category changes
  useEffect(() => {
    if (selectedCategoryId === "all") {
      setSelectedAssetTypeId("all");
      setSelectedSupplierId("all");
    } else {
      setSelectedAssetTypeId("all");
      // Keep supplier selection as it may not be category-dependent
    }
  }, [selectedCategoryId]);

  const handleViewClick = (asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (asset) => {
    setSelectedAsset(asset);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = (success) => {
    setIsEditModalOpen(false);
    // Refetching is handled by the main useEffect detecting the state change
    if (success) {
      alert("Cập nhật tài sản thành công!");
    }
  };

  const handleAddModalClose = (success) => {
    setIsAddModalOpen(false);
    if (success) {
      alert("Thêm tài sản thành công!");
      setCurrentPage(1);
    }
  }

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài sản này?")) {
      return;
    }
    try {
      await deleteAsset(id);
      toast.success("Xóa tài sản thành công");

      // Check if we deleted the last item on a page > 1
      if (assets.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1); // Go to previous page
      } else {
        // Otherwise, just refetch the current page (triggered by useEffect)
        // To be safe, we can force a refetch here
        const filters = {
          page: currentPage,
          limit: limit,
          search: searchTerm || null,
          idDanhMucTaiSan: selectedCategoryId === "all" ? null : parseInt(selectedCategoryId),
          idLoaiTaiSan: selectedAssetTypeId === "all" ? null : parseInt(selectedAssetTypeId),
          idNhaCungCap: selectedSupplierId === "all" ? null : parseInt(selectedSupplierId),
        };
        await getAllAsset(filters);
      }
    } catch (err) {
      console.error(err);
      toast.error("Xóa tài sản thất bại");
    }
  };

  // Mobile Card Component
  const MobileAssetCard = ({ item, category }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-1">
              {item.ten_tai_san}
            </h3>
            {item.ten_nha_cung_cap && (
              <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                <Info className="w-3 h-3" />
                {item.ten_nha_cung_cap}
              </p>
            )}
          </div>
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm">
            {category?.ten || "N/A"}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Additional Info */}
        {item.thong_tin && Object.keys(item.thong_tin).length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Thông tin chi tiết
            </p>
            <div className="space-y-1.5">
              {Object.entries(item.thong_tin).map(([key, value]) => (
                <div key={key} className="flex text-xs">
                  <span className="font-semibold text-gray-700 min-w-[80px]">{key}:</span>
                  <span className="text-gray-600 flex-1 break-words">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Information Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-700 uppercase">Đăng ký</p>
            </div>
            <p className="text-sm font-bold text-emerald-700 text-center">
              {item?.ngay_dang_ky || "N/A"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <p className="text-xs font-semibold text-amber-700 uppercase">Hết hạn</p>
            </div>
            <p className="text-sm font-bold text-amber-700 text-center">
              {item?.ngay_het_han || "N/A"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-2"
            onClick={() => handleViewClick(item)}
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Xem</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center justify-center gap-2"
            onClick={() => handleEditClick(item)}
          >
            <Edit className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Sửa</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2"
            onClick={() => handleDeleteClick(item.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">Xóa</span>
          </Button>
        </div>
      </div>
    </div>
  );

  // Show full-page loader only on initial load
  if (assetLoading && pagination.total === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-4 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">Quản Lý Tài Sản</h1>
              <p className="text-gray-500 text-sm md:text-base mt-1">
                Trang quản lý và theo dõi tất cả tài sản của bạn
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
                + Thêm tài sản
              </Button>
            </div>
          </div>
        </div>

        {isAddModalOpen && (
          <AssetModal
            setIsModalOpen={setIsAddModalOpen}
          />
        )}
        {isViewModalOpen && selectedAsset && (
          <ViewAssetModal
            asset={selectedAsset}
            open={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
        {isEditModalOpen && selectedAsset && (
          <EditAssetModal
            asset={selectedAsset}
            dataCategory={categories}
            onClose={handleEditModalClose} // Use updated close handler
          />
        )}

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </Button>
          </div>

          <div className={`space-y-4 md:space-y-0 ${showFilters ? "block" : "hidden md:block"}`}>
            {/* First Row: Category and Asset Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Danh mục</label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất Cả Danh Mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Danh Mục</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.ten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Loại tài sản</label>
                <Select
                  value={selectedAssetTypeId}
                  onValueChange={setSelectedAssetTypeId}
                  disabled={selectedCategoryId === "all"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      selectedCategoryId === "all"
                        ? "Vui lòng chọn danh mục trước"
                        : "Tất Cả Loại Tài Sản"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Loại Tài Sản</SelectItem>
                    {assetTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.ten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row: Supplier and Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Nhà cung cấp</label>
                <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất Cả Nhà Cung Cấp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Nhà Cung Cấp</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={String(supplier.id)}>
                        {supplier.ten_nha_cung_cap || supplier.ten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Tìm kiếm</label>
                <Input
                  placeholder="Tìm kiếm tài sản, nhà cung cấp, loại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Reset Filters Button */}
            {(selectedCategoryId !== "all" || selectedAssetTypeId !== "all" || selectedSupplierId !== "all" || searchTerm) && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategoryId("all");
                    setSelectedAssetTypeId("all");
                    setSelectedSupplierId("all");
                    setSearchTerm("");
                  }}
                  className="text-sm"
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span>
                Hiển thị <strong>{assets.length}</strong> trên tổng số{" "}
                <strong>{pagination.total}</strong> tài sản
              </span>
              {(selectedCategoryId !== "all" || selectedAssetTypeId !== "all" || selectedSupplierId !== "all" || searchTerm) && (
                <span className="text-blue-600 text-xs">
                  (Đã áp dụng bộ lọc)
                </span>
              )}
            </div>
            {assetLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-500">Đang tải...</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {assets.length === 0 && !assetLoading ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không tìm thấy tài sản nào</p>
              <p className="text-gray-400 text-sm mt-2">Thử thay đổi bộ lọc hoặc thêm tài sản mới</p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <Table className="min-w-full table-fixed">
                  <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <TableRow>
                      {/* TÀI SẢN: 25% */}
                      <TableHead className="text-left font-semibold text-gray-700 px-4 py-4 w-[25%]">
                        TÀI SẢN
                      </TableHead>

                      {/* DANH MỤC: 15% */}
                      <TableHead className="text-center font-semibold text-gray-700 px-4 py-4 w-[15%]">
                        DANH MỤC
                      </TableHead>

                      {/* THÔNG TIN: 30% */}
                      <TableHead className="text-left font-semibold text-gray-700 px-4 py-4 w-[30%]">
                        THÔNG TIN
                      </TableHead>

                      {/* NGÀY ĐĂNG KÝ: 10% */}
                      <TableHead className="text-center font-semibold text-gray-700 px-4 py-4 w-[10%]">
                        NGÀY ĐĂNG KÝ
                      </TableHead>

                      {/* NGÀY HẾT HẠN: 10% */}
                      <TableHead className="text-center font-semibold text-gray-700 px-4 py-4 w-[10%]">
                        NGÀY HẾT HẠN
                      </TableHead>

                      {/* THAO TÁC: 10% */}
                      <TableHead className="text-center font-semibold text-gray-700 px-4 py-4 w-[10%]">
                        THAO TÁC
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        {/* START - TÀI SẢN - 25% (Mở rộng và giữ break-words) */}
                        <TableCell className="px-4 py-4 w-[25%] align-top">
                          <div className="font-medium text-gray-900 text-sm break-words">
                            {item.ten_tai_san}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {item.ten_nha_cung_cap}
                          </div>
                        </TableCell>
                        {/* END - TÀI SẢN */}

                        {/* DANH MỤC - 15% */}
                        <TableCell className="text-center px-4 py-4 w-[15%] align-top">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs inline-block font-medium">
                            {categories.find((c) => c.id === item.danh_muc_tai_san_id)
                              ?.ten || "N/A"}
                          </span>
                        </TableCell>

                        {/* THÔNG TIN - 30% (Thu hẹp lại) */}
                        <TableCell className="text-left align-top px-4 py-2 w-[30%]">
                          <div className="space-y-1 p-2 bg-gray-50 rounded text-sm max-h-20 overflow-y-auto border border-gray-200">
                            <ul className="list-disc ml-4 space-y-0.5">
                              {item.thong_tin &&
                                Object.entries(item.thong_tin).map(([key, value]) => (
                                  <li key={key} className="text-gray-700">
                                    <span className="font-semibold text-gray-800">
                                      {key}:
                                    </span>
                                    <span className="ml-1 text-gray-600 break-words">
                                      {String(value)}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                            {/* Trường hợp không có thông tin */}
                            {(!item.thong_tin ||
                              Object.keys(item.thong_tin).length === 0) && (
                                <div className="text-center text-gray-500 italic py-2">
                                  Không có thông tin chi tiết
                                </div>
                              )}
                          </div>
                        </TableCell>

                        {/* NGÀY ĐĂNG KÝ - 10% */}
                        <TableCell className="text-center px-4 py-4 w-[10%] align-top">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap inline-block">
                            {item?.ngay_dang_ky || "N/A"}
                          </span>
                        </TableCell>

                        {/* NGÀY HẾT HẠN - 10% */}
                        <TableCell className="text-center px-4 py-4 w-[10%] align-top">
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap inline-block">
                            {item?.ngay_het_han || "N/A"}
                          </span>
                        </TableCell>

                        {/* THAO TÁC - 10% */}
                        <TableCell className="text-center px-4 py-4 w-[10%] align-top">
                          <div className="flex justify-center items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 hover:bg-blue-100"
                              onClick={() => handleViewClick(item)}
                            >
                              <Eye className="w-3 h-3 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 hover:bg-yellow-100"
                              onClick={() => handleEditClick(item)}
                            >
                              <Edit className="w-3 h-3 text-yellow-500" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 hover:bg-red-100"
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="lg:hidden p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assets.map((item) => (
                    <MobileAssetCard
                      key={item.id}
                      item={item}
                      category={categories.find((c) => c.id === item.danh_muc_tai_san_id)}
                    />
                  ))}
                </div>
              </div>

              {/* Pagination Controls */}
              <PaginationControls
                pagination={pagination}
                onPageChange={setCurrentPage}
                onLimitChange={setLimit}
                limit={limit}
                isLoading={assetLoading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}