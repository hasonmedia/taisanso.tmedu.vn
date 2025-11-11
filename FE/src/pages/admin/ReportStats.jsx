import React, { useEffect, useState, useMemo } from "react";
import { UserStore } from "../../stores/tai_khoan";
import { AssetStore } from "../../stores/asset";
import { ThuongHieuStore } from "../../stores/thuonghieu";
import { AssetLoginInfoStore } from "../../stores/assetLoginInfo";
import { HardDrive } from "lucide-react";

import AssetCategorySelect from "../../components/AssetCategorySelect";
import AssetSelect from "../../components/AssetSelect";
import DepartmentSelect from "../../components/DepartmentSelect";
import EmployeeSelect from "../../components/EmployeeSelect";
import RevokeDatePicker from "../../components/RevokeDatePicker";
import ProgressSteps from "../../components/ProgressSteps";
import CustomFieldsForm from "../../components/CustomFieldsForm";
import SubmitSection from "../../components/SubmitSection";
import { DepartmentStore } from "@/stores/department";
import { useAuth } from "@/context/AuthContext";

export default function ReportStats() {
  const { createAssetLoginInfo } = AssetLoginInfoStore();
  const { data: allUsers, getUsers } = UserStore();
  const { data: allAssets, getAllAsset } = AssetStore();
  const { data: allDMAssets, getAllThuongHieu } = ThuongHieuStore();
  const { data: phong_ban, getAllDepartment } = DepartmentStore();
  const auth = useAuth();
  const [selectedDMAssetId, setSelectedDMAssetId] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeesInDepartment, setEmployeesInDepartment] = useState([]);
  const [assetsInCategory, setAssetsInCategory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revokeDate, setRevokeDate] = useState("");
  const defaultFields = [
    { key: "Email", value: "" },
    { key: "Username", value: "" },
    { key: "password", value: "" },
  ];
  const [customFields, setCustomFields] = useState(defaultFields);

  useEffect(() => {
    getAllThuongHieu();
    getUsers();
    getAllAsset();
    getAllDepartment();
  }, []);

  // lọc nhân viên theo phòng ban quản lý
  useEffect(() => {
    if (selectedDepartmentId) {
      const filteredEmployees = allUsers.filter(
        (u) => u.cap >= 1 && u.cap <= 3 && u.phong_ban_id === parseInt(selectedDepartmentId)
      ).map(u => ({
        ...u,
        displayName: (u.cap === 1 || u.cap === 2) ? `${u.ho_ten} (Cấp ${u.cap})` : u.ho_ten
      }));
      setEmployeesInDepartment(filteredEmployees);
    } else {
      setEmployeesInDepartment([]);
    }
    setSelectedEmployeeId("");
  }, [selectedDepartmentId, allUsers]);

  // lọc tài sản theo danh mục
  useEffect(() => {
    if (selectedDMAssetId) {
      const filtered = allAssets.filter(
        (a) => a.danh_muc_tai_san_id === parseInt(selectedDMAssetId)
      );
      setAssetsInCategory(filtered);
      setSelectedAssetId("");
    } else {
      setAssetsInCategory([]);
      setSelectedAssetId("");
    }
  }, [selectedDMAssetId, allAssets]);

  // validation
  const isFormValid =
    selectedDMAssetId && selectedAssetId && selectedDepartmentId && selectedEmployeeId;

  useEffect(() => {
    if (selectedDepartmentId) {
      const filteredEmployees = allUsers
        .filter(
          (u) =>
            (u.cap === 2 || u.cap === 3) && // chỉ lấy cấp 2 và 3
            u.phong_ban_id === parseInt(selectedDepartmentId)
        )
        .map((u) => ({
          ...u,
          displayName: `${u.ho_ten} (Cấp ${u.cap})`, // hiển thị Tên (Cấp x)
        }));

      setEmployeesInDepartment(filteredEmployees);
    } else {
      setEmployeesInDepartment([]);
    }
    setSelectedEmployeeId("");
  }, [selectedDepartmentId, allUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || !revokeDate) return;

    const customData = {};
    customFields.forEach(({ key, value }) => {
      if (key.trim()) customData[key] = value;
    });

    const payload = {
      TaiSanId: selectedAssetId,
      phong_ban_id: selectedDepartmentId,
      nguoi_dai_dien_id: auth.user.id,
      nguoi_nhan_id: selectedEmployeeId,
      thong_tin: customData,
      ngay_thu_hoi: revokeDate,
    };
    setIsSubmitting(true);
    const response = await createAssetLoginInfo(payload);
    if (response.status === true) {
      alert("Cấp phát tài sản thành công!");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-lg sm:shadow-2xl">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <HardDrive className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Cấp phát tài sản
              </h1>
              <p className="text-sm sm:text-base text-blue-100">
                Quản lý và phân bổ tài sản cho nhân viên
              </p>
            </div>
          </div>
        </div>

        {/* Form - Responsive */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Form Fields Grid - Responsive */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Thông tin cấp phát
            </h2>

            {/* Mobile: Stack all fields */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Asset Category */}
              <div className="lg:col-span-1">
                <AssetCategorySelect
                  allDMAssets={allDMAssets}
                  selectedDMAssetId={selectedDMAssetId}
                  setSelectedDMAssetId={setSelectedDMAssetId}
                />
              </div>

              {/* Asset Select */}
              <div className="lg:col-span-1">
                <AssetSelect
                  assetsInCategory={assetsInCategory}
                  selectedAssetId={selectedAssetId}
                  setSelectedAssetId={setSelectedAssetId}
                  disabled={!selectedDMAssetId}
                />
              </div>

              {/* Department Select */}
              <div className="lg:col-span-1">
                <DepartmentSelect
                  departments={phong_ban}
                  selectedDepartmentId={selectedDepartmentId}
                  setSelectedDepartmentId={setSelectedDepartmentId}
                />
              </div>

              {/* Employee Select */}
              <div className="lg:col-span-1">
                <EmployeeSelect
                  employees={employeesInDepartment}
                  selectedEmployeeId={selectedEmployeeId}
                  setSelectedEmployeeId={setSelectedEmployeeId}
                  disabled={!selectedDepartmentId}
                />
              </div>

              {/* Revoke Date */}
              <div className="lg:col-span-1">
                <RevokeDatePicker
                  revokeDate={revokeDate}
                  setRevokeDate={setRevokeDate}
                />
              </div>

              {/* Empty space for alignment on desktop */}
              <div className="hidden lg:block lg:col-span-1"></div>
            </div>
          </div>

          {/* Progress Steps - Responsive */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Tiến trình
            </h2>
            <ProgressSteps
              selectedDMAssetId={selectedDMAssetId}
              selectedAssetId={selectedAssetId}
              selectedManagerId={selectedDepartmentId}
              selectedEmployeeId={selectedEmployeeId}
            />
          </div>

          {/* Custom Fields - Responsive */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Thông tin đăng nhập
            </h2>
            <CustomFieldsForm
              customFields={customFields}
              setCustomFields={setCustomFields}
              defaultFields={defaultFields}
            />
          </div>

          {/* Submit Section - Responsive */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
            <SubmitSection
              isFormValid={isFormValid}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div >
  );
}