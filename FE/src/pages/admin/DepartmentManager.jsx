import { useEffect, useState } from "react";
import { DepartmentStore } from "../../stores/department";
import { Circle } from "lucide-react";

function DepartmentManager() {
    const department = DepartmentStore();
    const [newDept, setNewDept] = useState("");
    const [editDept, setEditDept] = useState(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        department.getAllDepartment();
    }, []);
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
            department.deleteDepartment(id);
        }
    };
    return (
        <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                Quản lý phòng ban
            </h2>

            {/* Form thêm phòng ban - Responsive */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Thêm phòng ban mới</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        className="flex-1 border border-gray-300 p-2 sm:p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên phòng ban..."
                    />
                    <button
                        onClick={async () => {
                            if (newDept.trim()) {
                                await department.createDepartment({ ten: newDept });
                                setNewDept("");
                            }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-colors font-medium"
                    >
                        Thêm
                    </button>
                </div>
            </div>

            {/* Danh sách phòng ban - Responsive */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-700">Danh sách phòng ban</h3>
                </div>

                {department.data.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {department.data.map((dept) => (
                            <div
                                key={dept.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                {/* Desktop Layout */}
                                <div className="hidden sm:flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-medium text-gray-900">
                                            {dept.ten}
                                        </span>
                                        <div className="relative">
                                            <Circle className="w-8 h-8 text-blue-500" />
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
                                                {dept.soluong}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditDept(dept);
                                                setEditName(dept.ten);
                                            }}
                                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dept.id)}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile Layout */}
                                <div className="sm:hidden space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-lg font-medium text-gray-900">
                                            {dept.ten}
                                        </span>
                                        <div className="relative">
                                            <Circle className="w-8 h-8 text-blue-500" />
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
                                                {dept.soluong}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditDept(dept);
                                                setEditName(dept.ten);
                                            }}
                                            className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors text-sm"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => department.deleteDepartment(dept.id)}
                                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500 italic">
                        Chưa có phòng ban nào
                    </div>
                )}
            </div>

            {/* Modal sửa - Responsive */}
            {editDept && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">
                            Sửa phòng ban
                        </h3>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault(); // ngăn reload trang
                                await department.updateDepartment(editDept.id, {
                                    ...editDept,
                                    ten: editName,
                                });
                                setEditDept(null);
                            }}
                        >
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                className="border border-gray-300 p-2 sm:p-3 w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tên phòng ban..." required />
                            <div className="flex flex-col sm:flex-row justify-end gap-2">
                                <button onClick={() => setEditDept(null)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" > Hủy </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                >
                                    Lưu
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default DepartmentManager;