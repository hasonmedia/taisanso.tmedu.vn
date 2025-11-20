import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function ViewAssetModal({ asset, open, onClose }) {
  if (!asset) return null

  // Safe data access with fallbacks
  const safeAsset = {
    ten_tai_san: asset.ten_tai_san || "Không xác định",
    lien_he_nha_cung_cap: asset.lien_he_nha_cung_cap || "Không có",
    danh_muc_tai_san_ten: asset.danh_muc_tai_san_ten || "Chưa phân loại",
    ten_nha_cung_cap: asset.ten_nha_cung_cap || "Không xác định",
    ngay_dang_ky: asset.ngay_dang_ky || "N/A", // Thêm trường Ngày đăng ký
    ngay_het_han: asset.ngay_het_han || "N/A", // Thêm trường Ngày hết hạn
    thong_tin: asset.thong_tin || null,
    lien_he: asset.lien_he || "Không có",
    website: asset.website || "Không có",
  };

  const InfoRow = ({ label, value, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
      <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit sm:min-w-[150px]">
        {label}:
      </span>
      <span className="text-sm sm:text-base text-gray-900 break-words flex-1">
        {children || value}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-3xl lg:max-w-4xl rounded-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="space-y-1 pb-2 border-b border-gray-100">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-blue-700">
            Chi Tiết Tài Sản 🔎
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Thông tin đầy đủ và chi tiết về tài sản **{safeAsset.ten_tai_san}**.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">

          {/* Main Info Grid - 2 Columns (General Info) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

            {/* Cột 1: Thông tin Cơ bản */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-gray-800 border-b pb-1">
                Thông tin Chung
              </h3>

              <InfoRow label="Tên Tài Sản" value={safeAsset.ten_tai_san} />

              <InfoRow label="Danh Mục">
                <Badge variant="default" className="w-fit text-sm bg-blue-500 hover:bg-blue-600">
                  {safeAsset.danh_muc_tai_san_ten}
                </Badge>
              </InfoRow>

              <InfoRow label="Nhà Cung Cấp" value={safeAsset.ten_nha_cung_cap} />
            </div>

            {/* Cột 2: Ngày & Liên hệ */}
            <div className="space-y-4 pt-4 md:pt-0">
              <h3 className="font-bold text-base text-gray-800 border-b pb-1">
                Ngày & Liên hệ
              </h3>

              {/* Thêm Ngày Đăng ký */}
              <InfoRow label="Ngày Đăng ký">
                <Badge
                  variant="secondary"
                  className={`w-fit text-sm ${safeAsset.ngay_dang_ky !== 'N/A' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {safeAsset.ngay_dang_ky}
                </Badge>
              </InfoRow>

              {/* Thêm Ngày Hết hạn */}
              <InfoRow label="Ngày Hết hạn">
                <Badge
                  variant="secondary"
                  className={`w-fit text-sm ${safeAsset.ngay_het_han !== 'N/A' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {safeAsset.ngay_het_han}
                </Badge>
              </InfoRow>
              <InfoRow label="Liên Hệ" value={safeAsset.lien_he} />
              <InfoRow label="Số điện thoại" value={safeAsset.lien_he_nha_cung_cap} />
              <InfoRow label="Website" value={safeAsset.website} />
            </div>
          </div>

          {/* Additional Info Section - Full Width, Scrollable */}
          {safeAsset.thong_tin && Object.keys(safeAsset.thong_tin).length > 0 ? (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-bold mb-3 text-lg text-gray-800 flex items-center">
                Thông tin Chi tiết bổ sung:
              </h3>

              {/* Box chứa thông tin chi tiết với thanh cuộn */}
              <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-inner max-h-60 overflow-y-auto">
                <div className="space-y-3">
                  {Object.entries(safeAsset.thong_tin).map(([key, value], index) => (
                    <div
                      key={key || index}
                      className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
                    >
                      {/* Key - Tên thuộc tính */}
                      <span className="font-medium text-gray-700 text-sm sm:text-base min-w-fit sm:min-w-[150px] italic">
                        {key}:
                      </span>
                      {/* Value - Giá trị thuộc tính */}
                      <span className="text-sm sm:text-base text-gray-900 break-words flex-1 font-mono">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 text-center py-4 text-gray-500 italic">
              Không có thông tin chi tiết bổ sung.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}