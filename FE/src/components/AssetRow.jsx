import React from 'react'
import { formatDate } from '@/utils/helpers';
import { Eye, Pencil } from 'lucide-react';
import { capToLetter } from "../utils/capToLetter"
const AssetRow = ({ item, onView, onEdit }) => {
    const statusClass =
        item?.trang_thai?.toLowerCase() === "đang sử dụng"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";

    return (
        <>
            {/* Desktop table row - hidden on mobile */}
            <tr className="hidden lg:table-row bg-white border-b hover:bg-gray-50">
                <td className="px-4 xl:px-6 py-4 font-medium text-gray-900">{item?.ten_tai_san}</td>
                <td className="px-4 xl:px-6 py-4">{item?.ho_ten_nguoi_nhan}</td>
                <td className="px-4 xl:px-6 py-4">{capToLetter(item?.cap)}</td>
                <td className="px-4 xl:px-6 py-4">{item?.ten_phong_ban}</td>
                <td className="px-4 xl:px-6 py-4">{formatDate(item?.ngay_cap)}</td>
                <td className="px-4 xl:px-6 py-4">{formatDate(item?.ngay_thu_hoi)}</td>
                <td className="px-4 xl:px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
                        {item?.trang_thai}
                    </span>
                </td>
                <td className="px-4 xl:px-6 py-4 text-center">
                    <div className="flex justify-center gap-2 xl:gap-3">
                        <button
                            onClick={() => onView(item)}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Xem chi tiết"
                        >
                            <Eye className="w-4 h-4 xl:w-5 xl:h-5" />
                        </button>
                        <button
                            onClick={() => onEdit(item)}
                            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors"
                            title="Sửa thông tin"
                        >
                            <Pencil className="w-4 h-4 xl:w-5 xl:h-5" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Mobile card layout - shown only on mobile */}
            <tr className="lg:hidden">
                <td colSpan="100%" className="p-0">
                    <div className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50">
                        <div className="space-y-3">
                            {/* Header with asset name and status */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate">
                                        {item?.ten_tai_san}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {item?.ho_ten_nguoi_nhan}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${statusClass}`}>
                                    {item?.trang_thai}
                                </span>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-500">Cấp:</span>
                                    <span className="ml-1 text-gray-900">{capToLetter(item?.cap)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Phòng ban:</span>
                                    <span className="ml-1 text-gray-900">{item?.ten_phong_ban}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Ngày cấp:</span>
                                    <span className="ml-1 text-gray-900">{formatDate(item?.ngay_cap)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Thu hồi:</span>
                                    <span className="ml-1 text-gray-900">{formatDate(item?.ngay_thu_hoi)}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => onView(item)}
                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 
                                             px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                                    title="Xem chi tiết"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Xem</span>
                                </button>
                                <button
                                    onClick={() => onEdit(item)}
                                    className="flex items-center gap-1.5 text-green-600 hover:text-green-800 
                                             px-3 py-1.5 hover:bg-green-50 rounded-lg transition-colors text-sm"
                                    title="Sửa thông tin"
                                >
                                    <Pencil className="w-4 h-4" />
                                    <span>Sửa</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
};

export default AssetRow