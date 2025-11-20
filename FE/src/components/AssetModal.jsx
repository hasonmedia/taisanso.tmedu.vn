import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AssetStore } from "../stores/asset";
import { SupplierStore } from "../stores/supplier";
import { ThuongHieuStore } from "../stores/thuonghieu";
import LoaiTaiSanSelect from "./LoaiTaiSanSelect";
import SupplierSelect from "./SupplierSelect";
import AssetCategorySelectNew from "./AssetCategorySelectNew";
export default function AssetModal({ setIsModalOpen }) {
  const { data: asset, createAsset } = AssetStore();
  const { data: dataCategory } = ThuongHieuStore();
  const nhacungcap = SupplierStore();
  const [supplierSource, setSupplierSource] = useState("facebook");
  const [supplierType, setSupplierType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: nhacungcaps, getSuppliers } = nhacungcap;
  const [supplierSelected, setSupplierSelected] = useState("");
  const [loaiTaiSanSelected, setLoaiTaiSanSelected] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [dataSuppliers, setDataSuppliers] = useState([]);
  const [customFields, setCustomFields] = useState([
    { key: "Màu sắc", value: "Đỏ" },
    { key: "Kích thước", value: "L" },
  ]);
  const [errors, setErrors] = useState({});
  const [tenTaiSan, setTenTaiSan] = useState("");
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

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      { field: "tenTaiSan", value: tenTaiSan, message: "Tên tài sản không được để trống" },
      { field: "categorySelected", value: categorySelected, message: "Vui lòng chọn danh mục tài sản" },
      { field: "supplierSelected", value: supplierSelected, message: "Vui lòng chọn nhà cung cấp" },
      { field: "ngayDangKy", value: ngayDangKy, message: "Ngày đăng ký không được để trống" },
      // { field: "ngayHetHan", value: ngayHetHan, message: "Ngày hết hạn không được để trống" },
    ];

    requiredFields.forEach(({ field, value, message }) => {
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = message;
      }
    });

    // Kiểm tra ngày hết hạn phải sau ngày đăng ký
    if (ngayDangKy && ngayHetHan && new Date(ngayHetHan) <= new Date(ngayDangKy)) {
      newErrors.ngayHetHan = "Ngày hết hạn phải sau ngày đăng ký";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
      ten_tai_san: tenTaiSan,
      NhaCungCapId: finalSupplier,
      LoaiTaiSanId: loaiTaiSanSelected === "" ? null : loaiTaiSanSelected,
      thong_tin: customData,
      tong_so_luong: 1,
      DanhMucTaiSanId: categorySelected,
      so_luong_con: 1,
      ngay_dang_ky: ngayDangKy,
      ngay_het_han: ngayHetHan,
    };

    await createAsset(payload);
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
              Tên tài sản<span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Nhập tên tài sản"
              value={tenTaiSan}
              onChange={(e) => {
                setTenTaiSan(e.target.value);
                if (errors.tenTaiSan) {
                  setErrors(prev => ({ ...prev, tenTaiSan: "" }));
                }
              }}
              className={`w-full border rounded-lg p-2 sm:p-3 
                         text-sm sm:text-base
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         focus:outline-none transition-colors
                         ${errors.tenTaiSan ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.tenTaiSan && (
              <p className="text-red-500 text-sm mt-1">{errors.tenTaiSan}</p>
            )}
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Chọn danh mục<span className="text-red-500">*</span>
            </label>
            <AssetCategorySelectNew
              value={categorySelected}
              onValueChange={(value) => {
                setCategorySelected(String(value));
                const cat = dataCategory?.find((c) => String(c.id) === String(value));
                setSelectedCategory(cat || null);
                // Reset loại tài sản khi danh mục thay đổi
                setLoaiTaiSanSelected("");
                // Clear error when user selects
                if (errors.categorySelected) {
                  setErrors(prev => ({ ...prev, categorySelected: "" }));
                }
              }}
              placeholder="Chọn danh mục tài sản"
            />
            {errors.categorySelected && (
              <p className="text-red-500 text-sm mt-1">{errors.categorySelected}</p>
            )}
          </div>

          {/* Loại tài sản */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Loại tài sản
            </label>
            <LoaiTaiSanSelect
              value={loaiTaiSanSelected}
              onValueChange={setLoaiTaiSanSelected}
              placeholder={categorySelected ? "Chọn loại tài sản" : "Vui lòng chọn danh mục trước"}
              categoryId={categorySelected}
            />
          </div>
          {/* Nhà cung cấp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Nhà cung cấp<span className="text-red-500">*</span>
            </label>
            <SupplierSelect
              value={supplierSelected}
              onValueChange={(value) => {
                setSupplierSelected(value);
                // Clear error when user selects
                if (errors.supplierSelected) {
                  setErrors(prev => ({ ...prev, supplierSelected: "" }));
                }
              }}
              placeholder="Chọn nhà cung cấp"
              danhMucId={categorySelected}
            />
            {errors.supplierSelected && (
              <p className="text-red-500 text-sm mt-1">{errors.supplierSelected}</p>
            )}
          </div>
          {/* Ngày đăng ký và ngày hết hạn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Ngày đăng ký<span className="text-red-500">*</span>
              </label>
              <input
                name="ngay_dang_ky"
                type="date"
                value={ngayDangKy}
                onChange={e => {
                  setNgayDangKy(e.target.value);
                  if (errors.ngayDangKy) {
                    setErrors(prev => ({ ...prev, ngayDangKy: "" }));
                  }
                }}
                className={`w-full border rounded-lg p-2 sm:p-3 
                           text-sm sm:text-base
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           focus:outline-none transition-colors
                           ${errors.ngayDangKy ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ngayDangKy && (
                <p className="text-red-500 text-sm mt-1">{errors.ngayDangKy}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Ngày hết hạn
              </label>
              <input
                name="ngay_het_han"
                type="date"
                value={ngayHetHan}
                onChange={e => {
                  setNgayHetHan(e.target.value);
                  if (errors.ngayHetHan) {
                    setErrors(prev => ({ ...prev, ngayHetHan: "" }));
                  }
                }}
                className={`w-full border rounded-lg p-2 sm:p-3 
                           text-sm sm:text-base
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           focus:outline-none transition-colors
                           ${errors.ngayHetHan ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ngayHetHan && (
                <p className="text-red-500 text-sm mt-1">{errors.ngayHetHan}</p>
              )}
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