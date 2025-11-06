import { useEffect, useState } from "react";
import { AssetLoginInfoStore } from "../../stores/assetLoginInfo";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AssetStore } from "../../stores/asset";
import { useAuth } from "@/context/AuthContext";
import { UserStore } from "@/stores/tai_khoan";

export default function AssignAsset() {
  const assetLoginInfo = AssetLoginInfoStore();
  const { data: allAsset, getAllAsset } = AssetStore();
  const { data: dataLevel2, getUsers } = UserStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [customFields, setCustomFields] = useState([
    { key: "Email", value: "" },
    { key: "Username", value: "" },
    { key: "password", value: "" },
  ]);
  const [revokeDate, setRevokeDate] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        await getAllAsset();
        await getUsers();
      } catch (error) {
        console.error("❌ Lỗi khi load assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value ? Number(e.target.value) : "");
  };

  const handleAddField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  const handleRemoveField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleChangeField = (index, field, val) => {
    const newFields = [...customFields];
    newFields[index][field] = val;
    setCustomFields(newFields);
  };

  const handleResetDefault = () => {
    setCustomFields([
      { key: "Email", value: "" },
      { key: "Username", value: "" },
      { key: "password", value: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customData = {};
    customFields.forEach(({ key, value }) => {
      if (key.trim()) customData[key] = value;
    });

    const payload = {
      TaiSanId: selectedAssetId,
      nguoi_dai_dien_id: user?.id,
      nguoi_nhan_id: selectedEmployee,
      thong_tin: customData,
      ngay_thu_hoi: revokeDate,
    };
    const response = await assetLoginInfo.createAssetLoginInfo(payload);
    if (response.status == true) {
      toast.success("Cấp phát tài sản thành công");
      setSelectedAssetId("");
      setSelectedEmployee("");
      setRevokeDate("");
      handleResetDefault();
    }
  };

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Cấp phát tài sản cho nhân viên
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-4 sm:p-6 lg:p-8 space-y-4"
      >
        {/* Grid cho form chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tên tài sản */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên tài sản</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Chọn tài sản --</option>
              {allAsset?.map((ts, index) => (
                <option key={index} value={ts?.id}>
                  {ts?.ten_tai_san}
                </option>
              ))}
            </select>
          </div>

          {/* Người yêu cầu */}
          <div>
            <label className="block text-sm font-medium mb-1">Người yêu cầu</label>
            <input
              type="text"
              value={user?.ho_ten || ""}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100"
            />
          </div>

          {/* Người nhận */}
          <div>
            <label className="block text-sm font-medium mb-1">Người nhận</label>
            <select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Chọn nhân viên --</option>
              {dataLevel2?.map((nv, index) => (
                <option key={index} value={nv?.id}>
                  {nv?.ho_ten}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày thu hồi */}
          <div>
            <label className="block text-sm font-medium mb-1">Ngày thu hồi</label>
            <input
              type="datetime-local"
              value={revokeDate}
              onChange={(e) => setRevokeDate(e.target.value)}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Custom fields */}
        <div className="border rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
            <label className="font-semibold">Thông tin đăng nhập cấp phát</label>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <button
                type="button"
                onClick={handleAddField}
                className="text-blue-600 hover:underline text-sm"
              >
                + Thêm trường
              </button>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-gray-600 hover:underline text-sm"
              >
                ↺ Reset mặc định
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {customFields.map((field, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tên thuộc tính"
                  value={field.key}
                  onChange={(e) =>
                    handleChangeField(index, "key", e.target.value)
                  }
                  className="flex-1 border rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Giá trị"
                  value={field.value}
                  onChange={(e) =>
                    handleChangeField(index, "value", e.target.value)
                  }
                  className="flex-1 border rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            Tạo tài sản
          </button>
        </div>
      </form>
    </div>
  );
}
