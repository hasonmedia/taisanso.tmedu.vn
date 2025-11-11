import { useEffect, useState } from "react";
import { ThuongHieuStore } from "../../stores/thuonghieu";
import { AssetStore } from "../../stores/asset";
import { UserStore } from "@/stores/tai_khoan";
import { DepartmentStore } from "@/stores/department";
import { AssetRequestStore } from "../../stores/assetRequest";
import { useNavigate } from "react-router-dom";
import {
  Package,
  User,
  FileText,
  Send,
  ChevronRight,
  Building2,
  Users,
  AlertCircle,
  CheckCircle2,
  Eye,
  ExternalLink,
  Loader2,
  RefreshCw
} from "lucide-react";

function RequestAsset() {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [details, setDetails] = useState([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const navigate = useNavigate();

  const { data: departments, getAllDepartment } = DepartmentStore();
  const { data: danhmuctaisan, getAllThuongHieu } = ThuongHieuStore();
  const { data: assets, getAllAsset } = AssetStore();
  const { data: dataLevel2, getUsers } = UserStore();
  const { createAssetRequest } = AssetRequestStore();

  useEffect(() => {
    const fetchData = async () => {
      await getAllDepartment();
      await getUsers();
      await getAllThuongHieu();
    };
    fetchData();
  }, []);

  const handleAssetChange = async (e) => {
    const assetId = Number(e.target.value);
    setSelectedAsset(assetId);

    if (assetId) {
      await getAllAsset({ idDanhMucTaiSan: assetId });
      setActiveTab("assets");
    }
    setSelectedDetail("");
  };

  const selectedAssetDetail = assets.find(
    (item) => item.id === selectedDetail
  );

  const handleDetailSelect = (detailId) => {
    setSelectedDetail(detailId);
    setActiveTab("details");
  };

  const handleEmployeeChange = (e) =>
    setSelectedEmployee(Number(e.target.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDetail || !description || !selectedEmployee) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);

    const requestData = {
      TaiSanId: selectedDetail,
      noi_dung: description,
      nguoi_nhan_id: selectedEmployee,
    };

    try {
      const response = await createAssetRequest(requestData);

      if (response.status == true) {
        resetForm();
        alert("Gửi yêu cầu thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedAsset("");
    setSelectedDetail("");
    setDescription("");
    setSelectedEmployee("");
    setDetails([]);
    setActiveTab("form");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Yêu cầu cấp tài sản
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Tạo yêu cầu cấp tài sản cho nhân viên trong tổ chức của bạn
            </p>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <div className="flex bg-white rounded-lg shadow-sm border p-1">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === "form"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Form yêu cầu
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === "assets"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-800"
                }`}
              disabled={!selectedAsset}
            >
              <Package className="w-4 h-4 inline mr-1" />
              Tài sản ({details.length})
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === "details"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-800"
                }`}
              disabled={!selectedDetail}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Chi tiết
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6">
          {/* Form Column */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Thông tin yêu cầu
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Package className="w-4 h-4 mr-1 text-gray-500" />
                      Danh mục tài sản *
                    </label>
                    <select
                      value={selectedAsset}
                      onChange={handleAssetChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">-- Chọn danh mục tài sản --</option>
                      {danhmuctaisan?.map((item) => (
                        <option key={item?.id} value={item?.id}>
                          {item?.ten}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-1 text-gray-500" />
                      Nhân viên nhận *
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={handleEmployeeChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {dataLevel2?.map((item) => (
                        <option key={item?.id} value={item?.id}>
                          {item?.ho_ten}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-1 text-gray-500" />
                    Nội dung ghi chú *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Mô tả chi tiết về yêu cầu cấp tài sản..."
                    required
                    maxLength={500}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {description.length}/500 ký tự
                  </div>
                </div>

                {/* Selected Asset Preview */}
                {selectedAssetDetail && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Tài sản đã chọn
                    </h4>
                    <p className="text-blue-800 text-sm">
                      {selectedAssetDetail.ten_tai_san} - Còn lại: {selectedAssetDetail.so_luong_con} chiếc
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDetail || !description || !selectedEmployee}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi yêu cầu
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Làm mới
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Assets List Column */}
          <div className="w-80 bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Danh sách tài sản
                {assets.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {assets.length}
                  </span>
                )}
              </h3>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {!selectedAsset ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Chọn danh mục tài sản để xem danh sách
                  </p>
                </div>
              ) : assets?.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Không có tài sản nào trong danh mục này
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {assets.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedDetail === item.id
                        ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                        : "hover:bg-gray-50 border-gray-200"
                        }`}
                      onClick={() => handleDetailSelect(item.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.ten_tai_san}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Còn: {item.so_luong_con}/{item.tong_so_luong}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Asset Details Column */}
          <div className="w-80 bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-600" />
                Chi tiết tài sản
              </h3>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {!selectedDetail ? (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Chọn tài sản để xem chi tiết
                  </p>
                </div>
              ) : (
                <AssetDetailsCard asset={selectedAssetDetail} navigate={navigate} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Form Tab */}
          {activeTab === "form" && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Thông tin yêu cầu
                </h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Package className="w-4 h-4 mr-1 text-gray-500" />
                      Danh mục tài sản *
                    </label>
                    <select
                      value={selectedAsset}
                      onChange={handleAssetChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Chọn danh mục tài sản --</option>
                      {danhmuctaisan?.map((item) => (
                        <option key={item?.id} value={item?.id}>
                          {item?.ten}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-1 text-gray-500" />
                      Nhân viên nhận *
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={handleEmployeeChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {dataLevel2?.map((item) => (
                        <option key={item?.id} value={item?.id}>
                          {item?.ho_ten}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 mr-1 text-gray-500" />
                      Nội dung ghi chú *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Mô tả chi tiết về yêu cầu..."
                      required
                      maxLength={500}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {description.length}/500 ký tự
                    </div>
                  </div>

                  {selectedAssetDetail && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="font-medium text-blue-900 mb-1 flex items-center text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Tài sản đã chọn
                      </h4>
                      <p className="text-blue-800 text-xs">
                        {selectedAssetDetail.ten_tai_san} - Còn lại: {selectedAssetDetail.so_luong_con} chiếc
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedDetail || !description || !selectedEmployee}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Gửi
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === "assets" && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Danh sách tài sản
                  {details.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {details.length}
                    </span>
                  )}
                </h3>
              </div>
              <div className="p-4">
                {details?.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Không có tài sản nào trong danh mục này
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {details.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedDetail === item.id
                          ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                          : "hover:bg-gray-50 border-gray-200"
                          }`}
                        onClick={() => handleDetailSelect(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.ten_tai_san}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Nhà cung cấp: {item.ten_nha_cung_cap}
                            </p>
                            <p className="text-sm text-gray-500">
                              Còn: {item.so_luong_con}/{item.tong_so_luong}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-600" />
                  Chi tiết tài sản
                </h3>
              </div>
              <div className="p-4">
                {!selectedDetail ? (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Chọn tài sản để xem chi tiết
                    </p>
                  </div>
                ) : (
                  <AssetDetailsCard asset={selectedAssetDetail} navigate={navigate} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Asset Details Component
const AssetDetailsCard = ({ asset, navigate }) => {
  if (!asset) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <DetailItem
          label="Tên tài sản"
          value={asset.ten_tai_san}
          icon={<Package className="w-4 h-4" />}
        />
        <DetailItem
          label="Nhà cung cấp"
          value={asset.ten_nha_cung_cap}
          icon={<Building2 className="w-4 h-4" />}
        />
        <DetailItem
          label="Danh mục"
          value={asset.danh_muc_tai_san_ten}
        />
        <DetailItem
          label="Số lượng còn"
          value={`${asset.so_luong_con}/${asset.tong_so_luong}`}
          badge={asset.so_luong_con > 0 ? "available" : "unavailable"}
        />
        <DetailItem
          label="Liên hệ"
          value={asset.danh_muc_tai_san_lien_he}
        />
      </div>

      {asset.danh_muc_tai_san_link && (
        <div className="pt-3 border-t">
          <button
            onClick={() =>
              navigate(`/dashboard/quan-ly-danh-muc-tai-san/${asset.danh_muc_tai_san_id}`)
            }
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Xem chi tiết danh mục
          </button>
        </div>
      )}

      {asset.thong_tin && Object.keys(asset.thong_tin).length > 0 && (
        <div className="pt-3 border-t">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">
            Thông số kỹ thuật:
          </h4>
          <div className="space-y-2">
            {Object.entries(asset.thong_tin).map(([key, value], i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-600">{key}:</span>
                <span className="text-xs font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Detail Item Component
const DetailItem = ({ label, value, icon, badge }) => (
  <div className="flex justify-between items-start py-2">
    <div className="flex items-center">
      {icon && <span className="mr-2 text-gray-500">{icon}</span>}
      <span className="text-sm font-medium text-gray-700">{label}:</span>
    </div>
    <div className="flex items-center">
      <span className="text-sm text-gray-900 text-right">{value}</span>
      {badge && (
        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${badge === "available"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
          }`}>
          {badge === "available" ? "Có sẵn" : "Hết hàng"}
        </span>
      )}
    </div>
  </div>
);

export default RequestAsset;