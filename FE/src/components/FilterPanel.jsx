import React from 'react'

const FilterPanel = ({ departments, selectedDepartment, setSelectedDepartment, search, setSearch }) => (
    <div className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="w-full sm:w-auto sm:min-w-0">
                <select
                    value={selectedDepartment}
                    onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        setSearch("");
                    }}
                    className="w-full sm:w-64 border-2 border-gray-200 rounded-lg p-3 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white shadow-sm text-sm sm:text-base
                             transition-all duration-200"
                >
                    <option value="all">Tất cả phòng ban</option>
                    {departments.map((dept) => (
                        <option key={dept?.id} value={dept?.ten}>
                            {dept?.ten}
                        </option>
                    ))}
                </select>
            </div>

            {selectedDepartment !== "all" && (
                <div className="w-full sm:w-auto sm:min-w-0 animate-in slide-in-from-top-2 duration-200">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên nhân viên..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 border-2 border-gray-200 rounded-lg p-3 
                                 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 text-sm sm:text-base placeholder:text-gray-400
                                 transition-all duration-200"
                    />
                </div>
            )}
        </div>
    </div>
);

export default FilterPanel