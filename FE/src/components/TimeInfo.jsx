import React from 'react'
import { Calendar, Play, Square } from 'lucide-react';

const TimeInfo = ({ start, end }) => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "Không xác định";
        return date.toLocaleString("vi-VN");
    }

    const formatDuration = (start, end) => {
        if (!start || !end) return "Không xác định";

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate)) return "Không xác định";

        const diffSeconds = Math.round((endDate - startDate) / 1000);

        if (diffSeconds < 60) {
            return `${diffSeconds} giây`;
        } else if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            return `${minutes} phút ${seconds > 0 ? `${seconds} giây` : ''}`;
        } else {
            const hours = Math.floor(diffSeconds / 3600);
            const minutes = Math.floor((diffSeconds % 3600) / 60);
            return `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ''}`;
        }
    };

    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-gray-700">Thời gian</span>
            </div>

            {/* Time Container */}
            <div className="bg-white/60 p-3 sm:p-4 rounded-lg space-y-3">
                {/* Start Time */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                    <div className="flex items-center gap-1 min-w-fit">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        <span className="text-sm sm:text-base font-medium text-green-700">START</span>
                    </div>
                    <div className="text-sm sm:text-base text-gray-900 break-words xs:break-normal">
                        {formatDateTime(start)}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200"></div>

                {/* End Time */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                    <div className="flex items-center gap-1 min-w-fit">
                        <Square className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                        <span className="text-sm sm:text-base font-medium text-red-700">END</span>
                    </div>
                    <div className="text-sm sm:text-base text-gray-900 break-words xs:break-normal">
                        {formatDateTime(end)}
                    </div>
                </div>

                {/* Duration */}
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-600">
                        <span className="font-medium">Thời lượng:</span>{" "}
                        <span className="break-words">
                            {formatDuration(start, end)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimeInfo