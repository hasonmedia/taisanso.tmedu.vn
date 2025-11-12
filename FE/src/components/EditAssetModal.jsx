import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { AssetStore } from "../stores/asset";
import SupplierSelect from "./SupplierSelect";
import LoaiTaiSanSelect from "./LoaiTaiSanSelect";

export default function EditAssetModal({ asset, dataCategory, onClose }) {
  const { data: assetStore, updateAsset } = AssetStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    ten_tai_san: asset.ten_tai_san || "",
    DanhMucTaiSanId: asset.danh_muc_tai_san_id || "",
    NhaCungCapId: asset.nha_cung_cap_id || "",
    LoaiTaiSanId: asset.loai_tai_san_id || "",
    ngay_dang_ky: asset.ngay_dang_ky || "",
    ngay_het_han: asset.ngay_het_han || "",
    thong_tin: asset.thong_tin || {},
  });

  const [newField, setNewField] = useState({ key: "", value: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset supplier and asset type when category changes
      if (name === "DanhMucTaiSanId") {
        newData.NhaCungCapId = "";
        newData.LoaiTaiSanId = "";
      }

      return newData;
    });
  };

  const handleThongTinChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      thong_tin: { ...prev.thong_tin, [key]: value },
    }));
  };

  const handleAddThongTin = () => {
    if (!newField.key.trim()) return;
    setFormData((prev) => ({
      ...prev,
      thong_tin: { ...prev.thong_tin, [newField.key]: newField.value },
    }));
    setNewField({ key: "", value: "" });
  };

  const handleDeleteThongTin = (keyToDelete) => {
    setFormData((prev) => {
      const { [keyToDelete]: _, ...remainingThongTin } = prev.thong_tin;
      return { ...prev, thong_tin: remainingThongTin };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      let finalData = { ...formData };

      // Add new field if exists
      if (newField.key.trim()) {
        finalData.thong_tin[newField.key] = newField.value;
      }

      // Convert IDs to numbers if they exist
      if (finalData.DanhMucTaiSanId) {
        finalData.DanhMucTaiSanId = Number(finalData.DanhMucTaiSanId);
      }
      if (finalData.NhaCungCapId) {
        finalData.NhaCungCapId = Number(finalData.NhaCungCapId);
      }
      if (finalData.LoaiTaiSanId) {
        finalData.LoaiTaiSanId = Number(finalData.LoaiTaiSanId);
      }

      const response = await updateAsset(asset.id, finalData);
      if (response) {
        setSuccessMessage("✅ Cập nhật thành công!");
        // Clear new field after successful update
        setNewField({ key: "", value: "" });
      }
    } catch (error) {
      console.error("Failed to update asset:", error);
      setSuccessMessage("❌ Có lỗi xảy ra khi cập nhật tài sản!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-4">
      <div className="relative bg-white rounded-lg sm:rounded-xl shadow-lg 
                      p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-[600px] 
                      max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 
                     text-gray-500 hover:text-gray-800 
                     p-1 hover:bg-gray-100 rounded-full transition-colors
                     disabled:text-gray-300 disabled:hover:bg-transparent"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header */}
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center pr-8 sm:pr-10">
          Cập nhật tài sản
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 text-center text-green-600 font-semibold 
                          bg-green-50 rounded-lg border border-green-200">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Asset Name */}
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Tên tài sản:</label>
            <input
              type="text"
              name="ten_tai_san"
              value={formData.ten_tai_san}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 
                         text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         focus:outline-none transition-colors
                         disabled:bg-gray-100 disabled:text-gray-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Danh mục:</label>
            <select
              name="DanhMucTaiSanId"
              value={formData.DanhMucTaiSanId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 
                         text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         focus:outline-none transition-colors appearance-none bg-white
                         disabled:bg-gray-100 disabled:text-gray-500"
              disabled={isSubmitting}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              {dataCategory.map((cat) => (
                <option key={cat?.id} value={cat?.id}>
                  {cat?.ten}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Loại tài sản:
            </label>
            <LoaiTaiSanSelect
              value={formData.LoaiTaiSanId ? String(formData.LoaiTaiSanId) : ""}
              onValueChange={(value) => setFormData(prev => ({ ...prev, LoaiTaiSanId: value }))}
              placeholder={formData.DanhMucTaiSanId ? "Chọn loại tài sản" : "Vui lòng chọn danh mục trước"}
              categoryId={formData.DanhMucTaiSanId}
            />
          </div>
          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Nhà cung cấp:
            </label>
            <SupplierSelect
              value={formData.NhaCungCapId ? String(formData.NhaCungCapId) : ""}
              onValueChange={(value) => setFormData(prev => ({ ...prev, NhaCungCapId: value }))}
              placeholder="Chọn nhà cung cấp"
              danhMucId={formData.DanhMucTaiSanId}
            />
          </div>

          {/* Date Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 sm:mb-2">
                Ngày đăng ký:
              </label>
              <input
                type="date"
                name="ngay_dang_ky"
                value={formData.ngay_dang_ky}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 
                           text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           focus:outline-none transition-colors
                           disabled:bg-gray-100 disabled:text-gray-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 sm:mb-2">Ngày hết hạn:</label>
              <input
                type="date"
                name="ngay_het_han"
                value={formData.ngay_het_han}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 
                           text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           focus:outline-none transition-colors
                           disabled:bg-gray-100 disabled:text-gray-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Detailed Information */}
          <div>
            <label className="block text-sm font-medium mb-2 sm:mb-3">
              Thông tin chi tiết:
            </label>
            <div className="space-y-3">
              {Object.entries(formData.thong_tin).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row gap-2 sm:gap-3 
                                          p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-2 sm:space-y-0 sm:space-x-3 sm:flex sm:items-center">
                    <label className="text-sm font-medium text-gray-700 sm:min-w-[100px] sm:text-right">
                      {key}:
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleThongTinChange(key, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm 
                                 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 
                                 focus:outline-none transition-colors
                                 disabled:bg-gray-100 disabled:text-gray-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteThongTin(key)}
                    className="w-full sm:w-auto px-3 py-2 bg-red-500 text-white rounded-lg 
                               hover:bg-red-600 transition-colors flex items-center justify-center
                               disabled:bg-red-300 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="ml-1.5 sm:hidden">Xóa</span>
                  </button>
                </div>
              ))}

              {/* Add New Field */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 
                              bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                <div className="flex-1 space-y-2 sm:space-y-0 sm:space-x-3 sm:flex">
                  <input
                    type="text"
                    placeholder="Tên trường"
                    value={newField.key}
                    onChange={(e) =>
                      setNewField({ ...newField, key: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm 
                               focus:border-blue-500 focus:ring-1 focus:ring-blue-200 
                               focus:outline-none transition-colors
                               disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    placeholder="Giá trị"
                    value={newField.value}
                    onChange={(e) =>
                      setNewField({ ...newField, value: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm 
                               focus:border-blue-500 focus:ring-1 focus:ring-blue-200 
                               focus:outline-none transition-colors
                               disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddThongTin}
                  className="w-full sm:w-auto px-3 py-2 bg-green-500 text-white rounded-lg 
                             hover:bg-green-600 transition-colors flex items-center justify-center
                             disabled:bg-green-300 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" />
                  <span className="ml-1.5 sm:hidden">Thêm</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 
                          border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg 
                         hover:bg-gray-50 transition-colors font-medium
                         disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400
                         order-2 sm:order-1"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition-colors font-medium shadow-sm
                         disabled:cursor-not-allowed disabled:bg-blue-300
                         order-1 sm:order-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}