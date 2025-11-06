import React from 'react'
import { formatDate } from '@/utils/helpers';
import { Badge } from "@/components/ui/badge";
import { Building2, User, UserCheck, Calendar, FileText, Tag } from 'lucide-react';

const InfoField = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${className}`}>
        <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-500 block">{label}</span>
            <p className="font-semibold text-gray-800 mt-1 break-words">{value}</p>
        </div>
    </div>
);

const RequestInfo = ({ item }) => {
    console.log(item)
    return (
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Mobile: Stack all fields vertically */}
            <div className="block sm:hidden space-y-3">
                <InfoField
                    icon={Building2}
                    label="Bộ phận yêu cầu"
                    value={item?.ten || "Không rõ"}
                />
                <InfoField
                    icon={User}
                    label="Người yêu cầu"
                    value={item?.nguoi_yeu_cau || "Không rõ"}
                />
                <InfoField
                    icon={UserCheck}
                    label="Mã nhân viên nhận"
                    value={item?.ma_nhan_vien_nhan || "Không rõ"}
                />

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <Tag className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="text-sm text-gray-500 block">Danh mục tài sản</span>
                        <div className="mt-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                {item?.ten_danh_muc_tai_san || "Tài sản mới"}
                            </Badge>
                        </div>
                    </div>
                </div>

                <InfoField
                    icon={Building2}
                    label="Loại yêu cầu"
                    value={item?.loai || "Không rõ"}
                />
                <InfoField
                    icon={Calendar}
                    label="Ngày yêu cầu"
                    value={formatDate(item?.ngay_yeu_cau)}
                />
            </div>

            {/* Tablet and Desktop: Grid layout */}
            <div className="hidden sm:block">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <InfoField
                            icon={Building2}
                            label="Bộ phận yêu cầu"
                            value={item?.ten || "Không rõ"}
                        />
                        <InfoField
                            icon={User}
                            label="Người yêu cầu"
                            value={item?.nguoi_yeu_cau || "Không rõ"}
                        />
                    </div>

                    {/* Middle Column */}
                    <div className="space-y-4">
                        <InfoField
                            icon={UserCheck}
                            label="Mã nhân viên"
                            value={item?.ma_nhan_vien_yc || "Không rõ"}
                        />

                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <Tag className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <span className="text-sm text-gray-500 block">Danh mục tài sản</span>
                                <div className="mt-2">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {item?.ten_danh_muc_tai_san || "Tài sản mới"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 md:col-span-2 xl:col-span-1">
                        <InfoField
                            icon={Building2}
                            label="Loại yêu cầu"
                            value={item?.loai || "Không rõ"}
                        />
                        <InfoField
                            icon={Calendar}
                            label="Ngày yêu cầu"
                            value={formatDate(item?.ngay_yeu_cau)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Section - Full width on all screens */}
            <div className="mt-6">
                <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                    <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Lý do yêu cầu</h4>
                            <div className="bg-white p-3 rounded-md border border-gray-200">
                                <p className="text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
                                    {item?.noi_dung || "Không có mô tả"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats for larger screens */}
            <div className="hidden lg:block mt-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {item?.nguoi_yeu_cau_id ? "1" : "0"}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">Người nhận</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {item?.ngay_yeu_cau ? "1" : "0"}
                        </div>
                        <div className="text-xs text-green-600 mt-1">Yêu cầu</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {item?.ten_danh_muc_tai_san ? "1" : "0"}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">Danh mục</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestInfo;