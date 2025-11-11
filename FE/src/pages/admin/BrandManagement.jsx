import { useState } from "react";
import { Building2 } from "lucide-react";
import CategoryManagement from "./CategoryManagement";
import AssetTypeManagement from "./AssetTypeManagement";
import SupplierManagement from "./SupplierManagement";

export default function BrandManagement() {
  const [activeTab, setActiveTab] = useState("categories"); // 'categories', 'providers', hoặc 'asset-types'
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-2 px-3 text-sm font-medium transition-colors duration-200 ${activeTab === "categories"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Danh Mục Tài Sản
        </button>
        <button
          onClick={() => setActiveTab("asset-types")}
          className={`pb-2 px-3 text-sm font-medium transition-colors duration-200 ${activeTab === "asset-types"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Loại Tài Sản
        </button>
        <button
          onClick={() => setActiveTab("providers")}
          className={`pb-2 px-3 text-sm font-medium transition-colors duration-200 ${activeTab === "providers"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Danh Mục Nhà Cung Cấp
        </button>
      </div>

      {/* Render component tương ứng với activeTab */}
      {activeTab === "categories" && <CategoryManagement />}
      {activeTab === "asset-types" && <AssetTypeManagement />}
      {activeTab === "providers" && <SupplierManagement />}
    </div >
  );
}