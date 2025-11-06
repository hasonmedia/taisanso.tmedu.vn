import { AlertCircle, CheckCircle2, Send, Loader2 } from "lucide-react";

export default function SubmitSection({ isFormValid, isSubmitting }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            {/* Mobile Layout - Stacked */}
            <div className="block sm:hidden space-y-4">
                {/* Status Section */}
                <div className="flex items-center space-x-3">
                    {isFormValid ? (
                        <>
                            <div className="flex-shrink-0 p-2 bg-green-100 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-green-700 text-sm">Sẵn sàng cấp phát</p>
                                <p className="text-xs text-gray-500 leading-tight">Tất cả thông tin đã được điền đầy đủ</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex-shrink-0 p-2 bg-orange-100 rounded-full">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-orange-700 text-sm">Chưa đầy đủ thông tin</p>
                                <p className="text-xs text-gray-500 leading-tight">Vui lòng chọn đầy đủ tài sản, quản lý và nhân viên</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Submit Button - Full Width */}
                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${isFormValid && !isSubmitting
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] shadow-lg hover:shadow-xl"
                        : "bg-gray-400 cursor-not-allowed opacity-60"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            <span className="text-sm">Đang cấp phát...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            <span className="text-sm">Cấp phát tài sản</span>
                        </>
                    )}
                </button>
            </div>

            {/* Tablet Layout - Horizontal with wrapping */}
            <div className="hidden sm:block lg:hidden">
                <div className="flex flex-col space-y-4">
                    {/* Status Section */}
                    <div className="flex items-center space-x-3">
                        {isFormValid ? (
                            <>
                                <div className="flex-shrink-0 p-2 bg-green-100 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-green-700">Sẵn sàng cấp phát</p>
                                    <p className="text-sm text-gray-500">Tất cả thông tin đã được điền đầy đủ</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-shrink-0 p-2 bg-orange-100 rounded-full">
                                    <AlertCircle className="w-6 h-6 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-orange-700">Chưa đầy đủ thông tin</p>
                                    <p className="text-sm text-gray-500">Vui lòng chọn đầy đủ tài sản, quản lý và nhân viên</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Submit Button - Centered */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className={`flex items-center px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${isFormValid && !isSubmitting
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] shadow-lg hover:shadow-xl"
                                : "bg-gray-400 cursor-not-allowed opacity-60"
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Đang cấp phát...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-3" />
                                    Cấp phát tài sản
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Layout - Original horizontal */}
            <div className="hidden lg:block">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {isFormValid ? (
                            <>
                                <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-700 text-lg">Sẵn sàng cấp phát</p>
                                    <p className="text-sm text-gray-500">Tất cả thông tin đã được điền đầy đủ</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-shrink-0 p-3 bg-orange-100 rounded-full">
                                    <AlertCircle className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-orange-700 text-lg">Chưa đầy đủ thông tin</p>
                                    <p className="text-sm text-gray-500">Vui lòng chọn đầy đủ tài sản, quản lý và nhân viên</p>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className={`flex items-center px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${isFormValid && !isSubmitting
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] shadow-lg hover:shadow-xl"
                            : "bg-gray-400 cursor-not-allowed opacity-60"
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                Đang cấp phát...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-3" />
                                Cấp phát tài sản
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Progress Indicator for better UX */}
            {isSubmitting && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800">Đang xử lý yêu cầu...</p>
                            <p className="text-xs text-blue-600 mt-1">Vui lòng không tắt trang này</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Animation */}
            {isFormValid && !isSubmitting && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 animate-fade-in">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-800">Biểu mẫu đã sẵn sàng để gửi</p>
                    </div>
                </div>
            )}
        </div>
    );
}