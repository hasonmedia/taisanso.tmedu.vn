import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AssetStore } from "../stores/asset";
import { SupplierStore } from "../stores/supplier";
export default function AssetModal({ dataCategory, setIsModalOpen }) {
  const asset = AssetStore();
  const nhacungcap = SupplierStore();
  const [supplierSource, setSupplierSource] = useState("facebook");
  const [supplierType, setSupplierType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: nhacungcaps, getSuppliers } = nhacungcap;
  const [supplierSelected, setSupplierSelected] = useState("");
  const [dataSuppliers, setDataSuppliers] = useState([]);
  const [customFields, setCustomFields] = useState([
    { key: "Màu sắc", value: "Đỏ" },
    { key: "Kích thước", value: "L" },
  ]);
  useEffect(() => {
    const fetchSuppliers = async () => {
      const suppliers = await getSuppliers();
      setDataSuppliers(suppliers);
    };
    fetchSuppliers();
  }, [getSuppliers]);
  const [ngayDangKy, setNgayDangKy] = useState("");
  const [ngayHetHan, setNgayHetHan] = useState("");

  const handleAddField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newFields);
  };

  const handleChangeField = (index, field, val) => {
    const newFields = [...customFields];
    newFields[index][field] = val;
    setCustomFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customData = {};
    customFields.forEach(({ key, value }) => {
      if (key.trim()) customData[key] = value;
    });

    let finalSupplier = supplierSelected;

    if (selectedCategory?.ten?.toLowerCase().trim() === "social") {
      const supplierName = e.target.supplier?.value.trim() || "";
      finalSupplier = `${supplierSource} - ${supplierType} - ${supplierName}`;
    }

    const payload = {
      ten_tai_san: e.target.name.value,
      NhaCungCapId: finalSupplier,
      thong_tin: customData,
      tong_so_luong: 1,
      DanhMucTaiSanId: e.target.category.value,
      so_luong_con: 1,
      ngay_dang_ky: ngayDangKy,
      ngay_het_han: ngayHetHan,
    };

    await asset.createAsset(payload);
    await asset.getAllAsset();
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg sm:rounded-xl 
                   py-4 px-4 sm:py-6 sm:px-6 
                   w-full max-w-[95vw] sm:max-w-[600px] 
                   relative max-h-[95vh] overflow-y-auto"
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 
                     text-gray-500 hover:text-gray-700
                     p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:opacity-60" />
        </button>

        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center pr-8 sm:pr-10">
          Thêm Tài Sản Mới
        </h2>

        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {/* Tên tài sản */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Tên tài sản:
            </label>
            <input
              name="name"
              type="text"
              placeholder="Nhập tên tài sản"
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 
                         text-sm sm:text-base
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         focus:outline-none transition-colors"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Chọn danh mục:
            </label>
            <select
              name="category"
              onChange={(e) => {
                const cat = dataCategory.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                setSelectedCategory(cat || null);
              }}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 
                         text-sm sm:text-base
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         focus:outline-none transition-colors
                         appearance-none bg-white"
              defaultValue=""
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="" disabled>
                Chọn danh mục tài sản
              </option>
              {dataCategory?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.ten}
                </option>
              ))}
            </select>
          </div>

          {/* Nhà cung cấp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Nhà cung cấp:
            </label>
            {selectedCategory?.ten?.toLowerCase().trim() === "social" ? (
              <>
                {/* Chọn nguồn */}
                <select
                  value={supplierSource}
                  onChange={(e) => {
                    setSupplierSource(e.target.value);
                    setSupplierType("");
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-2
               text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="facebook">Facebook</option>
                  <option value="zalo">Zalo</option>
                  <option value="threads">Threads</option>
                </select>

                {/* Nếu social thì hiển thị loại */}
                {supplierSource && (
                  <select
                    value={supplierType}
                    onChange={(e) => setSupplierType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-2
                 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="" disabled>
                      Chọn loại
                    </option>
                    {supplierSource === "facebook" && (
                      <>
                        <option value="Fanpage">Fanpage</option>
                        <option value="Group">Group</option>
                        <option value="Nick">Tài khoản cá nhân</option>
                      </>
                    )}
                    {supplierSource === "zalo" && (
                      <>
                        <option value="ZaloOA">ZaloOA</option>
                        <option value="Group">Group</option>
                        <option value="Nick">Tài khoản cá nhân</option>
                      </>
                    )}
                    {supplierSource === "threads" && (
                      <option value="Profile">Profile</option>
                    )}
                  </select>
                )}

                {/* Input tên nhà cung cấp */}
                <input
                  name="supplier"
                  type="text"
                  placeholder="Nhập tên nhà cung cấp"
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 
               text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </>
            ) : (
              <select
                name="supplier"
                value={supplierSelected}
                onChange={(e) => setSupplierSelected(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 
             text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {dataSuppliers && dataSuppliers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ten}
                  </option>
                ))}
              </select>

            )}
          </div>

          {/* Ngày đăng ký và ngày hết hạn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Ngày đăng ký:
              </label>
              <input
                name="ngay_dang_ky"
                type="date"
                value={ngayDangKy}
                onChange={e => setNgayDangKy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 
                           text-sm sm:text-base
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Ngày hết hạn:
              </label>
              <input
                name="ngay_het_han"
                type="date"
                value={ngayHetHan}
                onChange={e => setNgayHetHan(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 
                           text-sm sm:text-base
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Custom fields */}
          <div className="border border-gray-300 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
              <label className="font-semibold text-gray-800 text-sm sm:text-base">
                Thông tin tùy biến
              </label>
              <button
                type="button"
                onClick={handleAddField}
                className="text-blue-600 hover:underline text-sm cursor-pointer 
                           self-start sm:self-center"
              >
                + Thêm trường
              </button>
            </div>

            <div className="max-h-[150px] sm:max-h-[180px] overflow-y-auto">
              <div className="space-y-2 sm:space-y-3">
                {customFields.map((field, index) => (
                  <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      placeholder="Tên thuộc tính"
                      value={field.key}
                      onChange={(e) =>
                        handleChangeField(index, "key", e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg p-2 
                                 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 
                                 focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Giá trị"
                      value={field.value}
                      onChange={(e) =>
                        handleChangeField(index, "value", e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg p-2 
                                 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 
                                 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="w-full sm:w-auto px-3 py-2 bg-red-500 text-white rounded-lg 
                                 cursor-pointer hover:bg-red-600 transition-colors
                                 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                      <span className="ml-1 sm:hidden">Xóa</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 
                         bg-gray-300 rounded-lg hover:bg-gray-400 
                         cursor-pointer transition-colors
                         order-2 sm:order-1 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 
                         bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         cursor-pointer transition-colors shadow-sm
                         order-1 sm:order-2 font-medium"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}