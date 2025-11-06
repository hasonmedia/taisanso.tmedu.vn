import { useEffect, useState } from "react";
import { Package, Users, AlertTriangle, Clock, Hourglass, Gift, PlusCircle, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssetStore } from "../../stores/asset";
import { UserStore } from "../../stores/tai_khoan";
import { AssetRequestStore } from "../../stores/assetRequest";
import { AssetLoginInfoStore } from "../../stores/assetLoginInfo";
import { formatDate } from "../../utils/formatDate";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
function DashboardAdmin() {
  const navigate = useNavigate();
  const { data: allAssets, getAllAsset } = AssetStore();
  const { data: users, getUsers } = UserStore();
  const { data: assetRequest, getAllAssetRequest } = AssetRequestStore();
  const {
    data: assetLoginInfo,
    expired: expiredSoonAssets,
    getAllAssetLoginInfo,
    getAssetExpired
  } = AssetLoginInfoStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllAsset(),
          getUsers(),
          getAllAssetRequest(),
          getAssetExpired(),
          getAllAssetLoginInfo(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalUser = users?.length ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-blue-500"></div>
          <p className="text-gray-600 text-sm md:text-base font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const pendingRequest = assetRequest?.yeu_cau?.filter(
    (item) => item.trang_thai === "đang chờ duyệt"
  ) || [];

  const StatCard = ({ icon: Icon, value, label, color, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="shadow-sm border rounded-xl hover:shadow-lg transition-all duration-300 h-full bg-white" onClick={onClick}>
        <CardContent className="flex items-center justify-between p-4 md:p-6 h-full">
          <div className="flex-1 min-w-0">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{value}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 leading-tight">{label}</p>
          </div>
          <div
            className={`p-2 md:p-3 rounded-full bg-gradient-to-tr ${color} transition-transform transform hover:scale-110 flex-shrink-0 ml-3`}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const InfoCard = ({ icon: Icon, title, children, isEmpty = false, emptyMessage }) => (
    <Card className="shadow-sm border rounded-xl hover:shadow-lg transition-all duration-300 h-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl px-4 py-3">
        <CardTitle className="flex items-center space-x-2 text-sm md:text-base font-semibold">
          <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isEmpty ? (
          <div className="p-4 md:p-6 text-center">
            <div className="text-gray-400 mb-2">
              <Icon className="w-8 h-8 md:w-12 md:h-12 mx-auto opacity-50" />
            </div>
            <p className="text-gray-500 text-sm md:text-base italic">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-80 md:max-h-96 overflow-y-auto">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Activity className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Dashboard Admin</h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">Tổng quan hệ thống quản lý tài sản</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <StatCard
            icon={Package}
            value={allAssets?.length || 0}
            label="Tổng tài sản"
            color="from-blue-500 to-blue-600"
            onClick={() => navigate("/dashboard/quan-ly-tai-san")}
          />
          <StatCard
            icon={Users}
            value={totalUser}
            label="Tổng người dùng"
            color="from-green-500 to-green-600"
            onClick={() => navigate("/dashboard/quan-ly-nguoi-dung")}
          />
          <StatCard
            icon={AlertTriangle}
            value={expiredSoonAssets?.length || 0}
            label="Sắp hết hạn"
            color="from-yellow-500 to-yellow-600"
            onClick={() => navigate("/dashboard/thong-bao-het-han")}
          />
          <StatCard
            icon={Clock}
            value={pendingRequest?.length || 0}
            label="Yêu cầu chờ"
            color="from-purple-500 to-purple-600"
            onClick={() => navigate("/dashboard/phe-duyet-yeu-cau")}
          />
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Pending Requests */}
          <InfoCard
            icon={Hourglass}
            title="Yêu cầu đang chờ duyệt"
            isEmpty={pendingRequest.length === 0}
            emptyMessage="Hiện tại chưa có yêu cầu cần phê duyệt"
          >
            {pendingRequest.map((item, index) => (
              <div key={`${item.ten_tai_san}-${index}`} className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-1">
                  {item.ten_tai_san}
                </p>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  Yêu cầu bởi: <span className="font-medium">{item.nguoi_yeu_cau}</span>
                </p>
              </div>
            ))}
          </InfoCard>

          {/* Recently Granted */}
          <InfoCard
            icon={Gift}
            title="Tài sản cấp gần nhất"
            isEmpty={!assetLoginInfo?.value || assetLoginInfo.value.length === 0}
            emptyMessage="Chưa có tài sản nào được cấp gần đây"
          >
            {assetLoginInfo?.value.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-1">
                  {item.ten_tai_san}
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  <span className="block sm:inline">Cấp cho: <span className="font-medium">{item.ten_phong_ban}</span></span>
                  <span className="block sm:inline sm:ml-1">- {formatDate(item.ngay_cap)}</span>
                </p>
              </div>
            ))}
          </InfoCard>

          {/* Recently Added Assets */}
          <InfoCard
            icon={PlusCircle}
            title="Tài sản mới thêm gần đây"
            isEmpty={!allAssets || allAssets.length === 0}
            emptyMessage="Chưa có tài sản nào được thêm"
          >
            {allAssets?.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
                <div className="mb-2">
                  <p className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">
                    {item.ten_tai_san}
                  </p>
                  {item.danh_muc_tai_san_ten && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {item.danh_muc_tai_san_ten}
                    </p>
                  )}
                </div>
                {item.danh_muc_tai_san_lien_he && (
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    {item.danh_muc_tai_san_lien_he}
                  </p>
                )}
              </div>
            ))}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;