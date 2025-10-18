import { HardDrive } from "lucide-react";

export default function AssetSelect({ assetsInCategory, selectedAssetId, setSelectedAssetId, disabled }) {
    const selectedAsset = assetsInCategory.find((a) => a.id === parseInt(selectedAssetId));

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-start sm:items-center space-x-3 mb-3 sm:mb-4">
                <HardDrive className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                        Chọn Tài sản
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0 leading-tight">
                        Tài sản cần cấp phát
                    </p>
                </div>
            </div>

            <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                disabled={disabled}
                className="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl 
                           p-2.5 sm:p-3 text-sm sm:text-base
                           disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                           appearance-none bg-white transition-colors"
                style={{
                    backgroundImage: disabled
                        ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                        : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                }}
            >
                <option value="">
                    {disabled ? "Vui lòng chọn danh mục trước..." : "Chọn tài sản..."}
                </option>
                {assetsInCategory.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                        {asset.ten_tai_san}
                    </option>
                ))}
            </select>

            {selectedAsset && (
                <div className="mt-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs sm:text-sm text-blue-700 font-medium flex items-center">
                        <span className="text-green-600 mr-1.5 flex-shrink-0">✓</span>
                        <span className="truncate">{selectedAsset.ten_tai_san}</span>
                    </p>
                </div>
            )}

            {/* Optional: Show asset count */}
            {assetsInCategory.length > 0 && (
                <div className="mt-2 text-xs sm:text-sm text-gray-400">
                    {assetsInCategory.length} tài sản có sẵn
                </div>
            )}
        </div>
    );
}