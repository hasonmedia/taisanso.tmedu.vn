import { useEffect, useState } from "react";
import { AssetLoginInfoStore } from "../../stores/assetLoginInfo";
import { formatDateTime, formatDate } from "../../utils/formatDate";
import { X } from "lucide-react";

function MyAsset() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeTab] = useState("using");
  const [selectedItem, setSelectedItem] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const assetLoginInfo = AssetLoginInfoStore();

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      setLoading(true);
      const result = await assetLoginInfo.getAssetLoginInfoPrivate();
      const data = result?.value?.map((item) => ({
        taisan: item,
        id: item.id,
        name: `${item.ten_tai_san} - ${item.ho_ten_nguoi_nhan}`,
        type: item.ten_danh_muc_tai_san,
        assignedDate: item.ngay_cap,
        details: {
          ...item.thong_tin,
          "Trạng thái": item.trang_thai,
          "Ngày thu hồi": item.ngay_thu_hoi,
          "Tên nhà cung cấp": item.ten_nha_cung_cap,
          "Họ tên người nhận": item.ho_ten_nguoi_nhan,
          "Họ tên người yêu cầu": item.ho_ten_nguoi_yeu_cau,
          "Phòng ban": item.ten_phong_ban,
        },
      }));
      setAssets(data);
      setSelectedAsset(data[0] || null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách tài sản.");
    } finally {
      setLoading(false);
    }
  }

  const isUrl = (str) => typeof str === "string" && /^https?:\/\//.test(str);
  const isPasswordKey = (key) =>
    key.toLowerCase().includes("mật khẩu") || key.toLowerCase().includes("password");
  const isDateFieldKey = (key, value) =>
    key.toLowerCase().includes("ngày") && !isNaN(new Date(value));

  if (loading)
    return <div className="text-center mt-10 text-xl text-gray-600">Đang tải tài sản...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10 font-bold">{error}</div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto mt-2 font-sans bg-gray-50 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
      {/* Danh sách tài sản */}
      <div className="w-full md:w-1/3 overflow-y-auto max-h-[400px] md:max-h-[600px] border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800 text-center md:text-left">
          Danh sách tài sản
        </h2>
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg font-medium ${activeTab === "using"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Đang sử dụng
          </button>
        </div>
        {assets.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">Không có tài sản nào.</p>
        ) : (
          <ul className="space-y-3">
            {assets.map((asset) => (
              <li
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`p-3 md:p-4 rounded-lg cursor-pointer transition shadow-sm border ${selectedAsset?.id === asset.id
                  ? "bg-blue-100 border-blue-600"
                  : "bg-white hover:bg-blue-50 border-gray-200"
                  }`}
              >
                <p className="font-semibold text-sm md:text-base">{asset.name}</p>
                <span className="text-xs md:text-sm text-gray-500">{asset.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chi tiết tài sản */}
      <div className="flex-1 bg-white p-4 md:p-6 rounded-lg shadow-md max-h-[400px] md:max-h-[600px] overflow-y-auto">
        {selectedAsset ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold mb-3">{selectedAsset.name}</h2>
            <p className="mb-2 text-gray-700 text-sm md:text-base">
              <span className="font-semibold">Loại tài sản: </span>
              {selectedAsset.type}
            </p>
            <p className="mb-4 italic text-gray-700 text-sm md:text-base">
              Ngày cấp: {formatDateTime(selectedAsset.assignedDate)}
            </p>

            <h3 className="text-lg md:text-xl font-semibold mb-3">Chi tiết tài sản</h3>
            <div className="space-y-2">
              {Object.entries(selectedAsset.details).map(([key, value]) => {
                const isPassword = isPasswordKey(key);
                const isLink = isUrl(value);
                const isDateField = isDateFieldKey(key, value);

                return (
                  <p key={key} className="text-gray-800 break-words text-sm md:text-base">
                    <span className="font-semibold">{key}: </span>
                    {isPassword ? (
                      "••••••••"
                    ) : isLink ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {value}
                      </a>
                    ) : isDateField ? (
                      formatDate(value)
                    ) : (
                      value || "—"
                    )}
                  </p>
                );
              })}
            </div>
            <button
              onClick={() => {
                setSelectedItem(selectedAsset);
                setOldPassword("");
                setNewPassword("");
              }}
              className="mt-4 px-3 py-2 md:px-4 md:py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm md:text-base"
            >
              Sửa thông tin
            </button>
          </>
        ) : (
          <p className="text-gray-600 text-center md:text-left">Vui lòng chọn một tài sản.</p>
        )}

        {/* Popup sửa */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md md:max-w-lg relative">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Chi tiết đăng nhập</h3>

              {/* Info không cho sửa */}
              <div className="space-y-2 mb-4 text-sm md:text-base">
                <p><b>Tài sản:</b> {selectedItem.taisan.ten_tai_san}</p>
                <p><b>Người nhận:</b> {selectedItem.taisan.ho_ten_nguoi_nhan}</p>
                <p><b>Người yêu cầu:</b> {selectedItem.taisan.ho_ten_nguoi_yeu_cau}</p>
                <p><b>Danh mục:</b> {selectedItem.taisan.ten_danh_muc_tai_san}</p>
              </div>

              {/* Form chỉ cho sửa thong_tin */}
              <div className="border-t pt-4 space-y-3">
                {Object.entries(selectedItem.taisan.thong_tin || {}).map(([key, value]) => (
                  <div key={key} className="text-sm md:text-base">
                    <label className="block font-semibold mb-1">{key}</label>
                    {isPasswordKey(key) ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="password"
                          placeholder="Nhập mật khẩu cũ"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="border rounded p-2 text-sm md:text-base"
                        />
                        <input
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="border rounded p-2 text-sm md:text-base"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            taisan: {
                              ...prev.taisan,
                              thong_tin: {
                                ...prev.taisan.thong_tin,
                                [key]: e.target.value,
                              },
                            },
                          }))
                        }
                        className="border rounded p-2 w-full text-sm md:text-base"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-3 py-2 border rounded text-sm md:text-base"
                >
                  Đóng
                </button>
                <button
                  disabled={saving}
                  className={`px-3 py-2 rounded text-white text-sm md:text-base ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                    }`}
                  onClick={async () => {
                    try {
                      setSaving(true);
                      const updated = {
                        ...selectedItem.taisan,
                        thong_tin: {
                          ...selectedItem.taisan.thong_tin,
                          ...(newPassword
                            ? { password: newPassword, passwordOld: oldPassword }
                            : {}),
                        },
                      };
                      await assetLoginInfo.updateAssetLoginInfo(
                        selectedItem.taisan.id,
                        updated
                      );
                      await fetchAssets();
                      setSelectedItem(null);
                      setOldPassword("");
                      setNewPassword("");
                    } catch (err) {
                      alert("Cập nhật thất bại.");
                      console.error(err);
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAsset;
