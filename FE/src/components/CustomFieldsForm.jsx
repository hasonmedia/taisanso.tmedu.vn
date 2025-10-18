import { Plus, RotateCcw, Trash2, Settings } from "lucide-react";

export default function CustomFieldsForm({ customFields, setCustomFields, defaultFields }) {
    const handleAddField = () => setCustomFields([...customFields, { key: "", value: "" }]);
    const handleRemoveField = (index) => setCustomFields(customFields.filter((_, i) => i !== index));
    const handleChangeField = (index, field, val) => {
        const newFields = [...customFields];
        newFields[index][field] = val;
        setCustomFields(newFields);
    };
    const handleResetDefault = () => setCustomFields(defaultFields);

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div className="flex items-start sm:items-center space-x-3">
                    <Settings className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
                            Thông tin đăng nhập
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0 leading-tight">
                            Cấu hình thông tin truy cập cho tài sản
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handleAddField}
                        className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 
                                   text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 
                                   transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        <span>Thêm</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleResetDefault}
                        className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 
                                   text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 
                                   transition-colors text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4 mr-1.5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {/* Fields Container */}
            <div className="max-h-80 sm:max-h-96 overflow-y-auto space-y-3 sm:space-y-4">
                {customFields.map((field, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center 
                                                space-y-3 sm:space-y-0 sm:space-x-4 
                                                p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                        {/* Input Fields */}
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
                            <input
                                type="text"
                                placeholder="Tên thuộc tính"
                                value={field.key}
                                onChange={(e) => handleChangeField(index, "key", e.target.value)}
                                className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 
                                           text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                           focus:outline-none transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Giá trị"
                                value={field.value}
                                onChange={(e) => handleChangeField(index, "value", e.target.value)}
                                className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 
                                           text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                           focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Delete Button */}
                        <button
                            type="button"
                            onClick={() => handleRemoveField(index)}
                            className="w-full sm:w-auto flex items-center justify-center 
                                       p-2.5 sm:p-3 bg-red-500 text-white rounded-lg 
                                       hover:bg-red-600 transition-colors"
                            title="Xóa trường"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="ml-1.5 sm:hidden text-sm">Xóa</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {customFields.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                    <Settings className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-sm sm:text-base mb-2 sm:mb-3">
                        Chưa có trường thông tin nào
                    </p>
                    <button
                        type="button"
                        onClick={handleAddField}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 
                                   hover:underline transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm trường đầu tiên
                    </button>
                </div>
            )}

            {/* Optional: Field Counter */}
            {customFields.length > 0 && (
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 text-center">
                    {customFields.length} trường thông tin
                </div>
            )}
        </div>
    );
}