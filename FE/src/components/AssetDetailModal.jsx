import React from 'react'
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const AssetDetailModal = ({ selectedItem, onClose, onSave }) => {
    const [formData, setFormData] = useState(selectedItem?.thong_tin || {});

    useEffect(() => {
        if (selectedItem) {
            const thong_tin = { ...selectedItem.thong_tin };
            if ("password" in thong_tin) {
                thong_tin.password = "";
            }
            setFormData(thong_tin);
        }
    }, [selectedItem]);

    if (!selectedItem) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 
                            w-full max-w-[95vw] sm:max-w-[500px] 
                            relative max-h-[95vh] sm:max-h-[90vh] 
                            overflow-y-auto">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 
                               text-gray-500 hover:text-gray-700 
                               p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Header */}
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 pr-8 sm:pr-10">
                    Chi tiết đăng nhập
                </h3>

                {/* General Information */}
                <div className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-semibold mb-1 sm:mb-0 sm:min-w-[120px]">Tài sản:</span>
                        <span className="break-words">{selectedItem?.ten_tai_san}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-semibold mb-1 sm:mb-0 sm:min-w-[120px]">Người nhận:</span>
                        <span className="break-words">{selectedItem?.ho_ten_nguoi_nhan}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-semibold mb-1 sm:mb-0 sm:min-w-[120px]">Người yêu cầu:</span>
                        <span className="break-words">{selectedItem?.ho_ten_nguoi_yeu_cau}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-semibold mb-1 sm:mb-0 sm:min-w-[120px]">Danh mục:</span>
                        <span className="break-words">{selectedItem?.ten_danh_muc_tai_san}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-semibold mb-1 sm:mb-0 sm:min-w-[120px]">Ngày cấp:</span>
                        <span>{formatDate(selectedItem?.ngay_cap)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-semibold mb-1 sm:mb-0 sm:min-w-[120px]">Ngày thu hồi:</span>
                        <span>{formatDate(selectedItem?.ngay_thu_hoi)}</span>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
                    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Thông tin cấp phát:
                    </h4>

                    <div className="space-y-3 sm:space-y-4">
                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="flex flex-col space-y-1 sm:space-y-2">
                                <label className="font-semibold text-sm sm:text-base text-gray-700">
                                    {key}
                                </label>
                                <input
                                    type={key === "password" ? "password" : "text"}
                                    value={formData[key] ?? ""}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, [key]: e.target.value }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2 sm:p-3 
                                               text-gray-700 text-sm sm:text-base
                                               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                               focus:outline-none transition-colors"
                                    placeholder={key === "password" ? "Nhập mật khẩu mới" : ""
                                    }
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 sm:py-2.5 
                                   border border-gray-300 rounded-lg
                                   text-gray-700 font-medium
                                   hover:bg-gray-50 transition-colors
                                   order-2 sm:order-1"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="w-full sm:w-auto px-4 py-2 sm:py-2.5 
                                   bg-blue-600 text-white rounded-lg 
                                   font-medium hover:bg-blue-700 
                                   transition-colors shadow-sm
                                   order-1 sm:order-2"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetDetailModal