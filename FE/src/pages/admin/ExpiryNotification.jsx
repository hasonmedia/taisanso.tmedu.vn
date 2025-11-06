import { Bell, AlertTriangle, Edit3, X, Settings, Mail, AwardIcon } from "lucide-react";
import { AssetLoginInfoStore } from "../../stores/assetLoginInfo";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { UserStore } from "@/stores/tai_khoan";
import { MailStore } from "@/stores/nhan_mail";
import { capToLetter } from "../../utils/capToLetter"
export default function ExpiryNotification() {
  const { expired, getAssetExpired, updateAssetLoginInfo } = AssetLoginInfoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailConfigOpen, setIsEmailConfigOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const { data, getUsers } = UserStore();
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const { data: mail, getAllMails, saveMail } = MailStore();
  useEffect(() => {
    const fetchData = async () => {
      await getAssetExpired();
      await getUsers();
      await getAllMails();
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = data.filter(user => user.cap === 1 || user.cap === 0);
      setAvailableRecipients(filtered);
    }
  }, [data]);
  console.log("mail ", mail)
  useEffect(() => {
    if (mail && mail.recipients) {
      setSelectedRecipients(mail.recipients);
    }
  }, [mail]);

  const handleOpenModal = (asset) => {
    setSelectedAsset(asset);
    const date = new Date(asset.ngay_thu_hoi);
    const currentExpiry = date.toLocaleDateString("en-CA");

    setNewExpiryDate(currentExpiry);
    setNewStatus(asset.trang_thai);
    setIsModalOpen(true);
  };

  const handleOpenEmailConfig = () => {
    setIsEmailConfigOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAsset || !newExpiryDate) return;

    const response = await updateAssetLoginInfo(
      selectedAsset.id,
      {
        ngay_thu_hoi: newExpiryDate,
        trang_thai: newStatus,
      }
    );
    if (response) {
      alert("Cập nhật thành công!");
      setIsModalOpen(false);
      setSelectedAsset(null);
      await getAssetExpired();
    } else {
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleRecipientChange = (recipient) => {
    setSelectedRecipients(prev => {
      const exists = prev.find(r => r.id === recipient.id);
      if (exists) {
        // bỏ ra nếu đã có
        return prev.filter(r => r.id !== recipient.id);
      } else {
        // thêm object { id, email }
        return [...prev, { id: recipient.id, email: recipient.username }];
      }
    });
  };

  const handleSaveEmailConfig = async () => {
    const config = {
      recipients: selectedRecipients
    };
    try {
      const response = await saveMail(config);
      if (response.success) {
        alert("Cấu hình email đã được lưu thành công!");
        setIsEmailConfigOpen(false);
      }
    } catch (error) {
      console.log("Lưu cấu hình thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-t-4 border-blue-500 p-3 sm:p-4 flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Thông Báo Hết Hạn
          </h1>
        </div>
        <button
          onClick={handleOpenEmailConfig}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Cấu hình Email</span>
          <span className="sm:hidden">Email</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-600 text-white text-left">
                <th className="py-3 px-4 text-center font-semibold">TÀI SẢN</th>
                <th className="py-3 px-4 text-center font-semibold">NHÀ CUNG CẤP</th>
                <th className="py-3 px-4 text-center font-semibold">PHÒNG BAN</th>
                <th className="py-3 px-4 text-center font-semibold">THÔNG TIN</th>
                <th className="py-3 px-4 text-center font-semibold">NGÀY HẾT HẠN</th>
                <th className="py-3 px-4 text-center font-semibold">THỜI GIAN CÒN LẠI</th>
                <th className="py-3 px-4 text-center font-semibold">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-center font-semibold">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {expired?.map((item, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors`}
                >
                  <td className="py-3 px-4 font-semibold text-blue-800 text-center">
                    {item?.ten_tai_san}
                  </td>
                  <td className="py-3 px-4 text-center">{item?.ten_nha_cung_cap}</td>
                  <td className="py-3 px-4 text-center">{item?.ten_phong_ban}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="text-sm text-left">
                      {item?.thong_tin && typeof item.thong_tin === "object" ? (
                        Object.entries(item.thong_tin).map(([key, value]) => (
                          <div key={key}>
                            <b>{key}:</b> {String(value)}
                          </div>
                        ))
                      ) : (
                        <div>Không có thông tin</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {formatDate(item?.ngay_thu_hoi)}
                  </td>
                  <td className="py-3 px-4 text-sky-500 text-center font-medium">
                    {item?.so_ngay_con_lai > 0
                      ? `${item?.so_ngay_con_lai} ngày`
                      : "Đã hết hạn"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${item?.trang_thai?.toLowerCase() === "Đang sử dụng"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {item?.trang_thai}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex space-x-2 text-center justify-center">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="cursor-pointer hover:opacity-60 px-3 py-1 rounded bg-blue-400 text-white flex items-center space-x-1 transition-opacity"
                    >
                      <Edit3 className="w-4 h-4" /> <span>Cập Nhật</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden bg-white rounded-lg shadow-sm overflow-hidden">
        {expired?.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {expired.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  {/* Asset name and status */}
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-blue-800 text-base leading-tight">
                      {item?.ten_tai_san}
                    </h3>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${item?.trang_thai?.toLowerCase() === "Đang sử dụng"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {item?.trang_thai}
                    </span>
                  </div>

                  {/* Basic info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-gray-700">Nhà cung cấp:</span>{" "}
                      {item?.ten_nha_cung_cap}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phòng ban:</span>{" "}
                      {item?.ten_phong_ban}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ngày hết hạn:</span>{" "}
                      {formatDate(item?.ngay_thu_hoi)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Còn lại:</span>{" "}
                      <span className="text-sky-500 font-medium">
                        {item?.so_ngay_con_lai > 0
                          ? `${item?.so_ngay_con_lai} ngày`
                          : "Đã hết hạn"}
                      </span>
                    </div>
                  </div>

                  {/* Additional info */}
                  {item?.thong_tin && typeof item.thong_tin === "object" && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-700 mb-2 text-sm">
                        Thông tin chi tiết:
                      </div>
                      <div className="text-sm space-y-1">
                        {Object.entries(item.thong_tin).map(([key, value]) => (
                          <div key={key} className="flex flex-wrap">
                            <span className="font-medium text-gray-600 mr-1">{key}:</span>
                            <span className="text-gray-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Cập nhật thông tin</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 italic">
            Không có tài sản nào sắp hết hạn
          </div>
        )}
      </div>

      {/* Update Asset Modal */}
      {isModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 pr-8 text-gray-800">
              Cập nhật cho: {selectedAsset.ten_tai_san}
            </h3>
            <div onSubmit={handleUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ngày hết hạn mới
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Trạng thái
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Đã thu hồi">Đã thu hồi</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Configuration Modal */}
      {isEmailConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEmailConfigOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-6">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">
                Cấu hình thông báo Email
              </h3>
            </div>

            <div className="space-y-6">
              {/* Email Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3">Cài đặt thông báo</h4>
              </div>

              {/* Recipients Selection */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Chọn người nhận thông báo ({selectedRecipients.length} được chọn)
                </h4>

                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                  {availableRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`recipient-${recipient.id}`}
                            checked={selectedRecipients.some(r => r.id === recipient.id)}
                            onChange={() => handleRecipientChange(recipient)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`recipient-${recipient.id}`}
                              className="block font-medium text-gray-800 cursor-pointer"
                            >
                              {recipient.ho_ten}
                            </label>
                            <div className="text-sm text-gray-600">
                              {recipient.username}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">
                              {capToLetter(recipient.cap)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsEmailConfigOpen(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEmailConfig}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Lưu cấu hình</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}