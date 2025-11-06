import { ArrowRight, ArrowDown } from "lucide-react";

export default function ProgressSteps({ selectedDMAssetId, selectedAssetId, selectedManagerId, selectedEmployeeId }) {
    const steps = [
        { id: selectedDMAssetId, label: "Danh mục", color: "blue" },
        { id: selectedAssetId, label: "Tài sản", color: "green" },
        { id: selectedManagerId, label: "Quản lý", color: "blue" },
        { id: selectedEmployeeId, label: "Nhân viên", color: "purple" }
    ];

    const completedSteps = steps.filter(step => step.id).length;

    const getColorClasses = (color, isActive) => {
        const colors = {
            blue: isActive ? "text-blue-600 bg-blue-600" : "text-gray-400 bg-gray-300",
            green: isActive ? "text-green-600 bg-green-600" : "text-gray-400 bg-gray-300",
            purple: isActive ? "text-purple-600 bg-purple-600" : "text-gray-400 bg-gray-300"
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
                <h3 className="font-semibold text-gray-800 text-lg">Tiến trình cấp phát</h3>
                <span className="text-sm text-gray-500 font-medium">
                    {completedSteps}/4 bước hoàn thành
                </span>
            </div>

            {/* Desktop/Tablet - Horizontal Layout */}
            <div className="hidden sm:flex items-center justify-between space-x-2 lg:space-x-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center flex-1">
                        <div className={`flex items-center space-x-2 flex-1 ${getColorClasses(step.color, step.id).split(' ')[0]}`}>
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getColorClasses(step.color, step.id).split(' ').slice(1).join(' ')}`}></div>
                            <span className="text-sm font-medium truncate">{step.label}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile - Vertical Layout */}
            <div className="sm:hidden space-y-3">
                {steps.map((step, index) => (
                    <div key={index}>
                        <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${step.id ? 'bg-gray-50 border-l-4 border-l-' + step.color + '-500' : 'bg-gray-25'
                            }`}>
                            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${getColorClasses(step.color, step.id).split(' ').slice(1).join(' ')}`}></div>
                            <div className="flex-1">
                                <div className={`font-medium ${getColorClasses(step.color, step.id).split(' ')[0]}`}>
                                    {step.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Étape {index + 1}/4
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                {step.id ? (
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                )}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex justify-center py-1">
                                <ArrowDown className="w-4 h-4 text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progression</span>
                    <span>{Math.round((completedSteps / 4) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(completedSteps / 4) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}