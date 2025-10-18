import React, { useEffect, useState } from 'react';
import { ClipboardCheck, Package } from "lucide-react";
import { AssetRequestStore } from "../../stores/assetRequest";
import ApproveRequestFrom from "../../components/ApproveRequestFrom";
import RequestInfo from '@/components/RequestInfo';
import RequestActions from '@/components/RequestActions';
import { toast } from 'react-toastify';
import {
  Button,
} from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getStatusColor = (status) => {
  switch (status) {
    case "đang chờ duyệt":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "đã duyệt":
      return "bg-green-100 text-green-800 border-green-300";
    case "từ chối":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export default function ApproveRequests() {
  const { data, getAllAssetRequest, updateStatusAssetRequest } = AssetRequestStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await getAllAssetRequest();
    }
    fetchData();
  }, [isModalOpen, isRejectModalOpen]);

  const pendingRequest = data?.yeu_cau?.filter(
    (item) => item.trang_thai === "đang chờ duyệt"
  );

  const handleRejectSubmit = async (id) => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      const response = await updateStatusAssetRequest(id, {
        trang_thai: "từ chối",
        ly_do_tu_choi: rejectReason,
      });
      if (response.status == true) {
        alert("Từ chối phê duyệt ");
      }
      await getAllAssetRequest();
      setIsRejectModalOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu:", error);
      alert("Có lỗi xảy ra khi từ chối yêu cầu!");
    }
  };

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
    setRejectReason("");
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-t-4 border-blue-500 p-4 md:p-6 flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
        <ClipboardCheck className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 truncate">
            Phê Duyệt Yêu Cầu
          </h1>
          <p className="text-sm text-gray-600 mt-1 hidden sm:block">
            Quản lý và phê duyệt các yêu cầu tài sản
          </p>
        </div>
      </div>

      {/* Request List - Responsive */}
      <div className="space-y-4 md:space-y-6">
        {!pendingRequest || pendingRequest.length === 0 ? (
          <div className="text-center py-8 md:py-12 px-4">
            <ClipboardCheck className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg">Không có yêu cầu nào đang chờ duyệt</p>
          </div>
        ) : (
          pendingRequest.map((item) => (
            <Card key={item.yeu_cau_id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white">
              {/* Card Header - Responsive */}
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <CardTitle className="text-lg md:text-xl font-bold text-gray-800 leading-tight min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="break-words">
                        {item?.ten_tai_san || "Tài sản không xác định"}
                      </span>
                    </div>
                  </CardTitle>
                  <Badge
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium border ${getStatusColor(item.trang_thai)} flex-shrink-0`}
                  >
                    {item.trang_thai}
                  </Badge>
                </div>
              </CardHeader>

              {/* Card Content - Responsive Grid */}
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Request Info - Takes full width on mobile, 2 columns on large screens */}
                  <div className="lg:col-span-2">
                    <RequestInfo item={item} />
                  </div>

                  {/* Request Actions - Full width on mobile, 1 column on large screens */}
                  <div className="lg:col-span-1">
                    <RequestActions
                      item={item}
                      onApprove={(i) => {
                        setSelectedRequest(i);
                        setIsModalOpen(true);
                      }}
                      onReject={(i) => {
                        setSelectedRequest(i);
                        setIsRejectModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Approve Modal */}
      {isModalOpen && selectedRequest && (
        <ApproveRequestFrom
          data={selectedRequest}
          setIsModalOpen={setIsModalOpen}
          onSuccess={async () => {
            handleCloseModals();
            await getAllAssetRequest();
          }}
        />
      )}

      {/* Reject Dialog - Responsive */}
      <Dialog open={isRejectModalOpen}>
        <DialogContent className="sm:max-w-lg mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Nhập lý do từ chối</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600 font-medium">Yêu cầu:</span>
                  <span className="text-sm font-semibold text-gray-800 break-words">
                    {selectedRequest?.ten_tai_san}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600 font-medium">Người yêu cầu:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {selectedRequest?.nguoi_yeu_cau}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Ví dụ: Không đủ ngân sách, không phù hợp nhu cầu, thiếu thông tin..."
                className="resize-none w-full"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseModals}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRejectSubmit(selectedRequest?.yeu_cau_id)}
              disabled={!rejectReason.trim()}
              className="w-full sm:w-auto"
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}