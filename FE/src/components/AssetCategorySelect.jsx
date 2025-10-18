import { HardDrive } from "lucide-react";

export default function AssetCategorySelect({ allDMAssets, selectedDMAssetId, setSelectedDMAssetId }) {
    const selectedDMAsset = allDMAssets.find((dm) => dm.id === parseInt(selectedDMAssetId));

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-start sm:items-center space-x-3 mb-3 sm:mb-4">
                <HardDrive className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                        Chọn Danh mục tài sản
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0 leading-tight">
                        Danh mục tài sản được phép cấp
                    </p>
                </div>
            </div>

            <select
                value={selectedDMAssetId}
                onChange={(e) => setSelectedDMAssetId(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-sm sm:text-base 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                           appearance-none bg-white"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                }}
            >
                <option value="">Chọn danh mục tài sản...</option>
                {allDMAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                        {asset.ten}
                    </option>
                ))}
            </select>

            {selectedDMAsset && (
                <div className="mt-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs sm:text-sm text-blue-700 font-medium flex items-center">
                        <span className="text-green-600 mr-1.5">✓</span>
                        <span className="truncate">{selectedDMAsset.ten}</span>
                    </p>
                </div>
            )}
        </div>
    );
}