import { useEffect, useState } from "react";
import { Clock, User, Activity, FileText } from "lucide-react";
import { PersonalLogStore } from "../../stores/PersonalLog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PersonalLog() {
  const { getPersonalLogById } = PersonalLogStore();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const kq = await getPersonalLogById(page);
        setTotalPages(Math.ceil((kq?.[0]?.total_count || 0) / 20));
        setLogs(kq || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4 md:p-6 flex items-center space-x-3 shadow-lg mb-4 md:mb-6">
        <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
          <User className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight">
            Nhật Ký Cá Nhân
          </h1>
          <p className="text-blue-100 text-sm md:text-base mt-1">
            Theo dõi lịch sử hoạt động của bạn
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base md:text-lg">
            Chưa có hoạt động nào được ghi lại
          </p>
        </div>
      )}

      {/* Timeline Container - Responsive */}
      {!loading && logs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="relative border-l-2 border-blue-400 p-6 space-y-6 max-h-[600px] lg:max-h-[700px] overflow-y-auto">
              {logs.map((log, index) => (
                <motion.div
                  key={`${log.tai_khoan_username}-${index}`}
                  className="relative pl-10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Timeline Icon */}
                  <div className="absolute -left-4 top-3 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow text-white">
                    <Activity className="w-4 h-4" />
                  </div>

                  {/* Card */}
                  <div className="bg-gray-50 rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="font-semibold text-gray-800 text-base lg:text-lg">
                        {log.loai_hanh_dong}
                      </h2>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(log.thoi_gian_thuc_hien).toLocaleString("vi-VN")}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{log.tai_khoan_ho_ten}</span>
                        <span className="text-gray-400">({log.tai_khoan_username})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>Đăng nhập: {new Date(log.thoi_diem_dang_nhap).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {logs.map((log, index) => (
                <motion.div
                  key={`mobile-${log.tai_khoan_username}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-gray-50 rounded-lg border p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-1.5 rounded-full">
                        <Activity className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {log.loai_hanh_dong}
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-500" />
                          <span className="font-medium">{log.tai_khoan_ho_ten}</span>
                          <span className="text-gray-400">({log.tai_khoan_username})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>Đăng nhập: {new Date(log.thoi_diem_dang_nhap).toLocaleString("vi-VN", {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>

                      <div className="flex items-center gap-1 pt-1 border-t border-gray-200">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="font-medium">Thực hiện: {new Date(log.thoi_gian_thuc_hien).toLocaleString("vi-VN", {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination - Responsive */}
      {!loading && logs.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4 md:mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1"
            >
              Trước
            </Button>

            <span className="text-sm md:text-base font-medium px-3 py-1 bg-gray-100 rounded border">
              Trang {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1"
            >
              Sau
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            Tổng cộng {logs[0]?.total_count || 0} hoạt động
          </div>
        </div>
      )}
    </div>
  );
}