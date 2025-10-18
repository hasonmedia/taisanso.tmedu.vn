import { useAuth } from "@/context/AuthContext";
import { DepartmentStore } from "@/stores/department";
import { UserStore } from "@/stores/tai_khoan";
import ThemTaiKhoan from "../pages/admin/QuanLyTaiKhoan/ThemTaiKhoan";
import { useEffect, useState } from "react";
import { capToLetter } from "../utils/capToLetter"
export default function Profile() {
    const { user, fetchUser, setUser } = useAuth();
    const { data, getAllDepartment } = DepartmentStore();
    const { suaTaiKhoan } = UserStore();

    const [isEditing, setIsEditing] = useState(false); // ban đầu là false
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getAllDepartment();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            await suaTaiKhoan(user.id, formData);
            setUser(prev => ({ ...prev, ...formData }));
            alert("Cập nhật tài khoản thành công");
            setIsEditing(false);
        } catch (err) {
            alert("Lỗi cập nhật tài khoản:", err);
        } finally {
            setLoading(false);
        }
    };


    const editUserData = {
        ...user,
        phong_ban_id: user.PhongBanId,
        ten: data.find(d => d.id === user.PhongBanId)?.ten || "",
    };

    return (
        <div className="max-w-3xl mx-auto mt-8">
            {!isEditing ? (
                <div className="p-6 bg-white border rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin cá nhân</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                        <div>
                            <p className="text-sm font-medium text-gray-500">MSNV</p>
                            <p className="mt-1 text-lg font-semibold">{user?.m_s_n_v || "—"}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Họ tên</p>
                            <p className="mt-1 text-lg font-semibold">{user?.ho_ten}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Username</p>
                            <p className="mt-1 text-lg font-semibold">{user?.username}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                            <p className="mt-1 text-lg font-semibold">{user?.sdt || "—"}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Phòng ban</p>
                            <p className="mt-1 text-lg font-semibold">
                                {data.find((d) => d.id === user?.PhongBanId)?.ten || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Cấp</p>
                            <p className="mt-1 text-lg font-semibold">{capToLetter(user?.cap)}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </div>

            ) : (
                <ThemTaiKhoan
                    showModal={true}
                    setShowModal={setIsEditing}
                    phong_ban={data}
                    onSubmit={handleSubmit}
                    editUser={editUserData}
                />
            )}
        </div>
    );
}
