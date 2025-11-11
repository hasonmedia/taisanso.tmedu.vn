import FilterPanel from "@/components/FilterPanel";
import AssetDetailModal from "@/components/AssetDetailModal";
import AssetRow from "@/components/AssetRow";
import { AssetLoginInfoStore } from "@/stores/assetLoginInfo";
import { DepartmentStore } from "@/stores/department";
import { useState, useEffect, useMemo } from "react";
import { capToLetter } from "@/utils/capToLetter";
function AssetLoginInfo() {
  const { data: allAssetInfo, getAllAssetLoginInfo, updateAssetLoginInfo } = AssetLoginInfoStore();
  const { data: departments, getAllDepartment } = DepartmentStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { getAllDepartment(); }, []);
  useEffect(() => { getAllAssetLoginInfo(page); }, [page]);

  useEffect(() => {
    const total = allAssetInfo?.value?.[0]?.total_count || 0;
    setTotalPages(Math.ceil(total / 20));
  }, [allAssetInfo]);

  // Lọc theo phòng ban
  const filteredByDepartment = useMemo(() => {
    const list = allAssetInfo?.value || [];
    if (selectedDepartment === "all") return list;
    return list.filter(item => item.ten_phong_ban?.toString() === selectedDepartment.toString());
  }, [selectedDepartment, allAssetInfo]);

  // Lọc theo search
  const filteredData = useMemo(() => {
    return filteredByDepartment.filter(
      (item) =>
        item.ten_tai_san?.toLowerCase().includes(search.toLowerCase()) ||
        item.ho_ten_nguoi_nhan?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, filteredByDepartment]);

  const handleEdit = (item) => setSelectedItem(item);

  const handleSave = async (formData) => {
    try {
      selectedItem.thong_tin = formData;
      await updateAssetLoginInfo(selectedItem.id, selectedItem);
      setSelectedItem(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header - Responsive */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Thông tin đăng nhập tài sản
        </h1>
        <div className="w-full lg:w-auto">
          <FilterPanel
            departments={departments || []}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            search={search}
            setSearch={setSearch}
          />
        </div>
      </div>

      {/* Table - Responsive */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto max-h-[100vh] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">Tên tài sản</th>
                <th className="px-6 py-3">Người nhận</th>
                <th className="px-6 py-3">Loại tài khoản</th>
                <th className="px-6 py-3">Phòng ban</th>
                <th className="px-6 py-3">Ngày cấp</th>
                <th className="px-6 py-3">Ngày thu hồi</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length > 0 ? (
                filteredData.map(item => (
                  <AssetRow
                    key={item?.id}
                    item={item}
                    onView={setSelectedItem}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 italic">
                    Không tìm thấy tài sản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          {filteredData?.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredData.map(item => (
                <div key={item?.id} className="p-4">
                  <div className="space-y-3">
                    {/* Header with asset name and status */}
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {item.ten_tai_san}
                      </h3>
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                        {item.trang_thai || 'N/A'}
                      </span>
                    </div>

                    {/* Asset details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-700">Người nhận:</span>{' '}
                        {item.ho_ten_nguoi_nhan}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Cấp:</span>{' '}
                        {capToLetter(item.cap)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phòng ban:</span>{' '}
                        {item.ten_phong_ban}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Ngày cấp:</span>{' '}
                        {item.ngay_cap}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Ngày thu hồi:</span>{' '}
                        {item.ngay_thu_hoi || 'N/A'}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Sửa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 italic">
              Không tìm thấy tài sản nào
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <AssetDetailModal
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={handleSave}
        />
      )}

      {/* Pagination - Responsive */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
        <div className="flex items-center space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
          >
            Prev
          </button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700 whitespace-nowrap">
            Trang {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetLoginInfo;