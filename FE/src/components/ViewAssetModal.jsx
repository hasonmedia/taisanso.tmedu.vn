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
    danh_muc_tai_san_lien_he: asset.danh_muc_tai_san_lien_he || "Không có",
    danh_muc_tai_san_link: asset.danh_muc_tai_san_link || "",
    danh_muc_tai_san_ten: asset.danh_muc_tai_san_ten || "Chưa phân loại",
    ten_nha_cung_cap: asset.ten_nha_cung_cap || "Không xác định",
    tong_so_luong: asset.tong_so_luong || 0,
    so_luong_con: asset.so_luong_con || 0,
    thong_tin: asset.thong_tin || null
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Chi Tiết Tài Sản</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Thông tin chi tiết về tài sản được chọn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Main Info Grid - Responsive Layout */}
          <div className="space-y-3 sm:space-y-4">
            {/* Asset Name */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
              <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit sm:min-w-[120px]">
                Tên:
              </span>
              <span className="text-sm sm:text-base text-gray-900 break-words">
                {safeAsset.ten_tai_san}
              </span>
            </div>

            {/* Contact */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
              <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit sm:min-w-[120px]">
                Liên hệ:
              </span>
              <span className="text-sm sm:text-base text-gray-900 break-words">
                {safeAsset.danh_muc_tai_san_lien_he}
              </span>
            </div>

            {/* Category */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit sm:min-w-[120px]">
                Danh mục:
              </span>
              <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                {safeAsset.danh_muc_tai_san_ten}
              </Badge>
            </div>

            {/* Supplier */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
              <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit sm:min-w-[120px]">
                Nhà cung cấp:
              </span>
              <span className="text-sm sm:text-base text-gray-900 break-words">
                {safeAsset.ten_nha_cung_cap}
              </span>
            </div>

            {/* Quantity Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">
                  Tổng số lượng:
                </span>
                <span className="text-sm sm:text-base text-gray-900 font-medium">
                  {safeAsset.tong_so_luong}
                </span>
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">
                  Số lượng còn:
                </span>
                <span className={`text-sm sm:text-base font-medium ${safeAsset.so_luong_con > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {safeAsset.so_luong_con}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          {safeAsset.thong_tin && Object.keys(safeAsset.thong_tin).length > 0 && (
            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-3 text-base sm:text-lg">
                Thông tin chi tiết:
              </h3>
              <div className="space-y-2">
                {Object.entries(safeAsset.thong_tin).map(([key, value], index) => (
                  <div key={key || index} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit sm:min-w-[150px]">
                      {key}:
                    </span>
                    <span className="text-sm sm:text-base text-gray-900 break-words flex-1">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}