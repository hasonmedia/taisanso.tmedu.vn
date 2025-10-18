import React, { useEffect, useState } from "react";
import { History, Clock } from "lucide-react";
import { activityHistory } from "../../stores/activityHistory";
import { DepartmentStore } from "../../stores/department";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import UserInfo from "@/components/UserInfo";
import TimeInfo from "@/components/TimeInfo";

const config = {
  color: "bg-blue-500",
  bgColor: "bg-blue-50",
  textColor: "text-blue-700"
};

export default function ActivityHistory() {
  const { data: phong_ban, getAllDepartment } = DepartmentStore();
  const { data, getAllHistory } = activityHistory();
  const [filters, setFilters] = useState({
    userId: "",
    phongBanId: "all",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async (useFilter = false) => {
    setLoading(true);
    setError("");
    try {
      let processedFilters = { ...filters };
      if (processedFilters.phongBanId === "all") {
        processedFilters.phongBanId = "";
      }
      const res = await getAllHistory(
        useFilter ? processedFilters : {},
        page
      );
      await getAllDepartment();

      if (!res || res.length === 0) {
        setError("Không có dữ liệu hoạt động");
        setTotalPages(1);
        return;
      }

      setTotalPages(Math.ceil((res?.[0]?.total_count || 0) / 20));
    } catch (e) {
      setError(
        e.response?.data?.message || "Không thể tải dữ liệu"
      );
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      userId: "",
      phongBanId: "all",
      startDate: "",
      endDate: "",
    });
  };

  useEffect(() => {
    setPage(1);
    fetchData(true);
  }, [filters]);

  useEffect(() => {
    fetchData(true);
  }, [page]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 md:p-6 mb-4 md:mb-6 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
            <History className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold truncate">Lịch Sử Hoạt Động</h1>
            <p className="text-blue-100 mt-1 text-sm md:text-base">Theo dõi các hoạt động của hệ thống</p>
          </div>
        </div>
      </div>

      {/* Bộ lọc - Responsive Grid */}
      <Card className="mb-4 md:mb-6 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mobile: Stack all filters vertically */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Phòng ban</label>
                <Select
                  onValueChange={(val) => handleChange("phongBanId", val)}
                  value={filters.phongBanId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                    {phong_ban.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id.toString()}>
                        {opt.ten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Từ ngày</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Đến ngày</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons - Full width on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                onClick={() => {
                  setPage(1);
                  fetchData(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                disabled={loading}
              >
                {loading ? "Đang lọc..." : "Lọc"}
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1 sm:flex-none"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline - Responsive Layout */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-semibold text-gray-800">Timeline Hoạt Động</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <ScrollArea className="h-[400px] md:h-[600px] pr-2 md:pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-gray-500 text-sm md:text-base">Đang tải dữ liệu...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8 md:py-12">
                <History className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base md:text-lg px-4">{error}</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line - adjusted for mobile */}
                <div className="absolute left-3 md:left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block"></div>

                {data.map((act, index) => (
                  <div key={`${act.hanh_dong_id}-${index}`} className="relative mb-4 md:mb-8 sm:pl-12 md:pl-16">
                    {/* Timeline dot - only on desktop */}
                    <div className="absolute left-2 md:left-5 top-4 w-2 h-2 bg-blue-500 rounded-full hidden sm:block"></div>

                    <Card className={`${config.bgColor} border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                      <CardContent className="p-3 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 md:mb-4 gap-3">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Badge
                              className={`${config.color} text-white border-0 px-2 md:px-4 py-1 md:py-2 text-sm md:text-lg font-bold rounded-lg`}
                            >
                              {act.loai_hanh_dong}
                            </Badge>
                          </div>
                        </div>

                        {/* User and Time Info - Stack on mobile, side by side on desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                          <div className="min-w-0">
                            <UserInfo
                              user={{
                                ho_ten: act.tai_khoan_ho_ten,
                                username: act.tai_khoan_username
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <TimeInfo
                              start={act.thoi_diem_dang_nhap}
                              end={act.thoi_gian_thuc_hien}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Pagination - Responsive */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 px-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-sm"
          >
            Trước
          </Button>
          <span className="text-sm md:text-base font-medium px-2">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm"
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}