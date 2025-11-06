import { useEffect, useState } from "react";
import { AssetLoginInfoStore } from "../../stores/assetLoginInfo";
import { PackageOpen, X, User, Users, Package, Calendar, Building2 } from "lucide-react";
import { UserStore } from "../../stores/tai_khoan";
import { useAuth } from "@/context/AuthContext";

function AssetDetailModal({ asset, onClose }) {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div
        className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md md:max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 p-1"
        >
          <X size={20} />
        </button>

        <div className="pr-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Chi tiết tài sản
          </h2>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Mã tài sản:</span>
              <span className="text-gray-900 text-sm">{asset.id}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Tên tài sản:</span>
              <span className="text-gray-900 text-sm break-words">{asset.ten_tai_san}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Người nhận:</span>
              <span className="text-gray-900 text-sm">{asset.ho_ten_nguoi_nhan}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Ngày cấp:</span>
              <span className="text-gray-900 text-sm">{asset.ngay_cap}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Ngày thu hồi:</span>
              <span className="text-gray-900 text-sm">{asset.ngay_thu_hoi || "Chưa thu hồi"}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Nhà cung cấp:</span>
              <span className="text-gray-900 text-sm break-words">{asset.ten_nha_cung_cap}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Phòng ban:</span>
              <span className="text-gray-900 text-sm">{asset.ten_phong_ban}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== User Detail Modal =====================
function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div
        className="bg-white rounded-xl p-4 md:p-6 w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 p-1"
        >
          <X size={20} />
        </button>

        <div className="pr-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Chi tiết nhân viên
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">ID:</span>
              <span className="text-gray-900 text-sm">{user.id}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Tên nhân viên:</span>
              <span className="text-gray-900 text-sm">{user.ho_ten}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Email:</span>
              <span className="text-gray-900 text-sm break-all">{user.email || "Chưa có"}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Số điện thoại:</span>
              <span className="text-gray-900 text-sm">{user.sdt}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Cấp:</span>
              <span className="text-gray-900 text-sm">{user.cap}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="font-medium text-gray-700 text-sm">Phòng ban:</span>
              <span className="text-gray-900 text-sm">{user.ten}</span>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          <div>
            <h3 className="font-semibold mb-3 text-base flex items-center gap-2">
              <PackageOpen className="w-4 h-4 text-blue-500" />
              Thông tin đăng nhập tài sản
            </h3>

            {!user.thong_tin_dang_nhap || user.thong_tin_dang_nhap.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Chưa có thông tin đăng nhập tài sản</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {user.thong_tin_dang_nhap.map((info, index) => (
                  <div
                    key={info.thong_tin_dang_nhap_id || index}
                    className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-gray-700">Tài sản:</span>
                        <p className="text-gray-900 break-words">{info.ten_tai_san}</p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">Nhà cung cấp:</span>
                        <p className="text-gray-900 break-words">{info.ten_nha_cung_cap}</p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">Ngày cấp:</span>
                        <p className="text-gray-900">{new Date(info.ngay_cap).toLocaleDateString('vi-VN')}</p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">Ngày thu hồi:</span>
                        <p className="text-gray-900">{new Date(info.ngay_thu_hoi).toLocaleDateString('vi-VN')}</p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">Trạng thái:</span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${info.trang_thai === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {info.trang_thai}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== Dashboard Manager =====================
function DashboardManager() {
  const assetLoginInfo = AssetLoginInfoStore();
  const userStore = UserStore();
  const user = useAuth();

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const assets = assetLoginInfo?.dataPrivate?.value ?? [];
  const employees = userStore.data;

  // Load data
  useEffect(() => {
    userStore.getUsers();
    assetLoginInfo.getAssetLoginInfoPrivate();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedAsset(null);
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", handleEsc);

    if (selectedAsset || selectedUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [selectedAsset, selectedUser]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 md:p-6 mb-4 md:mb-6 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Dashboard Manager</h1>
            <p className="text-blue-100 text-sm md:text-base mt-1">Quản lý tài sản và nhân viên</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Assets Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <PackageOpen className="text-blue-500 w-5 h-5" />
              Tài sản được cấp
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tổng số: <span className="font-medium">{assets.length}</span>
            </p>
          </div>

          <div className="p-4">
            {assets.length === 0 ? (
              <div className="text-center py-8">
                <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Chưa có tài sản nào được cấp</p>
              </div>
            ) : (
              <ul className="space-y-2 overflow-y-auto max-h-80 lg:max-h-96">
                {assets.map((asset) => (
                  <li
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors border hover:border-blue-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <span className="font-medium text-gray-900 text-sm break-words">
                        {asset.ten_tai_san}
                      </span>
                      <span className="text-xs text-gray-600 flex-shrink-0">
                        {asset.ho_ten_nguoi_nhan}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Employees Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Users className="text-green-500 w-5 h-5" />
              Danh sách nhân viên
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tổng số: <span className="font-medium">{employees.length}</span>
            </p>
          </div>

          <div className="p-4">
            {employees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Chưa có nhân viên nào</p>
              </div>
            ) : (
              <ul className="space-y-2 overflow-y-auto max-h-80 lg:max-h-96">
                {employees.map((emp) => (
                  <li
                    key={emp.id}
                    onClick={() => setSelectedUser(emp)}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-green-50 cursor-pointer transition-colors border hover:border-green-200"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900 text-sm break-words">
                        {emp.ho_ten}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssetDetailModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

export default DashboardManager;