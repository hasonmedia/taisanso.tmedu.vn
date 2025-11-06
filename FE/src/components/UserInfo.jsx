import React from 'react'
import { User } from 'lucide-react'

const UserInfo = ({ user }) => {
    // Safe access to user data
    const userData = user || {};
    const displayName = userData.ho_ten || "Không xác định";
    const displayUsername = userData.username || "unknown";

    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-gray-700">Thông tin người dùng</span>
            </div>

            {/* User Info Container */}
            <div className="bg-white/60 p-3 sm:p-4 rounded-lg space-y-3">
                {/* Full Name */}
                <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">
                        Họ tên:
                    </span>
                    <span className={`text-sm sm:text-base break-words ${displayName === "Không xác định"
                        ? "text-gray-500 italic"
                        : "text-gray-900"
                        }`}>
                        {displayName}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200"></div>

                {/* Username */}
                <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">
                        Username:
                    </span>
                    <span className={`text-sm sm:text-base break-all font-mono ${displayUsername === "unknown"
                        ? "text-gray-500 italic"
                        : "text-gray-900"
                        }`}>
                        {displayUsername}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default UserInfo