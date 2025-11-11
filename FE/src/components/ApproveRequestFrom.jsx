import { useState } from "react";
import { X } from "lucide-react";
import { AssetLoginInfoStore } from "../stores/assetLoginInfo";
import { AssetRequestStore } from "../stores/assetRequest";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { NotificationStore } from "../stores/notification"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ApproveRequestFrom({ setIsModalOpen, data }) {
  const assetLoginInfo = AssetLoginInfoStore();
  const assetRequest = AssetRequestStore();
  const notification = NotificationStore();
  const navigate = useNavigate();

  const defaultFields = [
    { key: "Email", value: "" },
    { key: "Username", value: "" },
    { key: "password", value: "" },
  ];

  const [customFields, setCustomFields] = useState(defaultFields);
  const [revokeDate, setRevokeDate] = useState("");

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
    setCustomFields(defaultFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customData = {};
    customFields.forEach(({ key, value }) => {
      if (key.trim()) customData[key] = value;
    });

    const payload = {
      TaiSanId: data?.tai_san_id,
      nguoi_dai_dien_id: data?.nguoi_yeu_cau_id,
      nguoi_nhan_id: data?.nguoi_nhan_id,
      thong_tin: customData,
      ngay_thu_hoi: revokeDate,
    };
    console.log("Payload to submit:", payload);

    const respone = await assetLoginInfo.createAssetLoginInfo(payload);
    console.log("Respone after creating asset login info:", respone);
    if (respone.status == true) {
      alert("Yêu cầu được chấp nhận ");
    }
    const response = await assetRequest.updateStatusAssetRequest(
      data.yeu_cau_id,
      { trang_thai: "đã duyệt" }
    );

    if (response.status === true) {
      toast.success("Chấp nhận phê duyệt");
      setIsModalOpen(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  };

  return (
    <Dialog open={true} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] w-full mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-1 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">Thông tin cấp tài sản</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 px-1 sm:px-0" onSubmit={handleSubmit}>
          {/* Tài sản */}
          <div>
            <Label className="mb-1 block text-sm">Tên tài sản</Label>
            <Input value={data?.ten_tai_san} readOnly className="text-sm" />
          </div>

          {/* Người yêu cầu */}
          <div>
            <Label className="mb-1 block text-sm">Tên người yêu cầu</Label>
            <Input value={data?.nguoi_yeu_cau} readOnly className="text-sm" />
          </div>

          {/* Người nhận */}
          <div>
            <Label className="mb-1 block text-sm">Tên người nhận</Label>
            <Input value={data?.nguoi_nhan} readOnly className="text-sm" />
          </div>

          {/* Ngày + giờ thu hồi - responsive */}
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày thu hồi
            </label>
            <input
              type="datetime-local"
              value={revokeDate}
              onChange={(e) => setRevokeDate(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Custom fields - optimized for mobile */}
          <div className="border rounded-lg p-2 sm:p-3 space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <Label className="font-semibold text-sm sm:text-base">
                Thông tin đăng nhập cấp phát
              </Label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 p-0 h-auto justify-start sm:justify-center"
                  onClick={handleAddField}
                >
                  + Thêm trường
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="text-gray-600 p-0 h-auto justify-start sm:justify-center"
                  onClick={handleResetDefault}
                >
                  ↺ Reset mặc định
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-[250px] sm:max-h-[200px] pr-1 sm:pr-2">
              <div className="space-y-3">
                {customFields.map((field, index) => (
                  <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      placeholder="Tên thuộc tính"
                      value={field.key}
                      onChange={(e) =>
                        handleChangeField(index, "key", e.target.value)
                      }
                      className="text-sm flex-1"
                    />
                    <Input
                      placeholder="Giá trị"
                      value={field.value}
                      onChange={(e) =>
                        handleChangeField(index, "value", e.target.value)
                      }
                      className="text-sm flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveField(index)}
                      className="w-full sm:w-auto"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                      <span className="ml-2 sm:hidden">Xóa</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Actions - responsive footer */}
          <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Hủy
            </Button>
            <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
              Tạo tài sản
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}