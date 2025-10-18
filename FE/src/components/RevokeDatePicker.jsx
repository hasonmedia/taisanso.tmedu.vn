import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export default function RevokeDatePicker({ revokeDate, setRevokeDate }) {
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');

    const validateDate = (dateValue) => {
        if (!dateValue) {
            setError('Vui lòng chọn ngày thu hồi');
            setIsValid(false);
            return false;
        }

        const selectedDate = new Date(dateValue);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            setError('Ngày thu hồi phải sau thời điểm hiện tại');
            setIsValid(false);
            return false;
        }

        setError('');
        setIsValid(true);
        return true;
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        setRevokeDate(value);
        validateDate(value);
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 transition-all duration-200 hover:shadow-2xl">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <label className="text-sm sm:text-base font-semibold text-gray-800">
                    Ngày thu hồi
                </label>
            </div>

            {/* Date Input */}
            <div className="space-y-3">
                <div className="relative">
                    <input
                        type="datetime-local"
                        value={revokeDate}
                        onChange={handleDateChange}
                        className={`w-full border rounded-xl p-3 sm:p-4 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isValid
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                            }`}
                        required
                        min={new Date().toISOString().slice(0, 16)}
                    />
                    <Clock className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isValid ? 'text-gray-400' : 'text-red-400'
                        }`} />
                </div>

                {/* Error Message */}
                {!isValid && error && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Display */}
                {isValid && revokeDate && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-green-800">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Ngày thu hồi được chọn:</p>
                                <p className="text-xs sm:text-sm mt-1 break-words">
                                    {formatDateForDisplay(revokeDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions for Mobile */}
            <div className="mt-4 sm:hidden">
                <p className="text-xs text-gray-500 mb-2">Chọn nhanh:</p>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: '+1 ngày', days: 1 },
                        { label: '+1 tuần', days: 7 },
                        { label: '+1 tháng', days: 30 },
                        { label: '+3 tháng', days: 90 }
                    ].map(({ label, days }) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => {
                                const futureDate = new Date();
                                futureDate.setDate(futureDate.getDate() + days);
                                const formattedDate = futureDate.toISOString().slice(0, 16);
                                setRevokeDate(formattedDate);
                                validateDate(formattedDate);
                            }}
                            className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Actions for Desktop */}
            <div className="mt-4 hidden sm:block">
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500 self-center mr-2">Chọn nhanh:</span>
                    {[
                        { label: 'Ngày mai', days: 1 },
                        { label: '1 tuần', days: 7 },
                        { label: '1 tháng', days: 30 },
                        { label: '3 tháng', days: 90 }
                    ].map(({ label, days }) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => {
                                const futureDate = new Date();
                                futureDate.setDate(futureDate.getDate() + days);
                                const formattedDate = futureDate.toISOString().slice(0, 16);
                                setRevokeDate(formattedDate);
                                validateDate(formattedDate);
                            }}
                            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Helper */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-blue-800 font-medium">Lưu ý</p>
                        <p className="text-xs sm:text-sm text-blue-700 mt-1">
                            Ngày thu hồi phải sau thời điểm hiện tại. Tài sản sẽ được thu hồi vào đúng thời gian đã chọn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}