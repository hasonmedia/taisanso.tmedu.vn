import { User } from "lucide-react";

export default function EmployeeSelect({ employees, selectedEmployeeId, setSelectedEmployeeId, disabled }) {
    const selectedEmployee = employees.find((e) => e.id === parseInt(selectedEmployeeId));

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 w-full max-w-full">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">Nhân viên</h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">Người nhận tài sản</p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    disabled={disabled}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 sm:p-4 
                             disabled:bg-gray-100 text-sm sm:text-base
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             transition-all duration-200"
                >
                    <option value="">
                        {disabled ? "Chọn quản lý trước..." : "Chọn nhân viên..."}
                    </option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.displayName || employee.ho_ten}
                        </option>
                    ))}
                </select>
            </div>

            {selectedEmployee && (
                <div className="mt-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-start space-x-2">
                        <span className="text-purple-600 text-sm font-medium flex-shrink-0">✓</span>
                        <p className="text-sm sm:text-base text-purple-700 font-medium break-words min-w-0">
                            {selectedEmployee.ho_ten}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}