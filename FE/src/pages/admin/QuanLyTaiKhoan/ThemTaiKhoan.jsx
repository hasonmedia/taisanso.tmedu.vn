import { useState, useEffect, useMemo } from "react"; // <-- Thêm useMemo
import {
    Eye,
    EyeOff,
    User,
    Lock,
    Phone,
    Building,
    Hash,
    Mail,
    Activity, // <-- Thêm icon mới
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ThemTaiKhoan({
    showModal,
    setShowModal,
    phong_ban,
    onSubmit,
    editUser,
}) {
    // Mock auth for demo
    const user = useAuth();
    // Thêm vào state ban đầu
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        ho_ten: "",
        sdt: "",
        m_s_n_v: "",
        cap: user.user.cap === 1 ? 2 : 0,
        PhongBanId: 0,
        is_active: true, // <-- Thêm trạng thái
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Sửa lỗi: Di chuyển logic này lên trên và dùng useMemo
    const availableOptions = useMemo(() => {
        const capOptions = [
            { value: 0, label: "Root" },
            { value: 1, label: "Quản trị viên" },
            { value: 2, label: "Trưởng bộ phận" },
            { value: 3, label: "Nhân viên" },
        ];

        if (!user?.user) return []; // Guard clause nếu user chưa load

        return capOptions.filter((opt) => {
            if (user.user.cap === 0) return true; // cấp 0 chọn tất cả
            if (user.user.cap === 1) return opt.value >= 2;
            if (user.user.cap === 2) return opt.value === 3;
            return false; // cấp 3 không chọn gì khác
        });
    }, [user?.user]); // Phụ thuộc vào user
    console.log("Available Options:", editUser, availableOptions);
    useEffect(() => {
        if (editUser) {
            setFormData({
                email: editUser.email || "",
                username: editUser.username || "",
                password: "",
                ho_ten: editUser.ho_ten || "",
                sdt: editUser.sdt || "",
                m_s_n_v: editUser.m_s_n_v || "",
                cap: editUser.cap || availableOptions[0]?.value || 0,
                PhongBanId: editUser.phong_ban_id || 0,
                is_active: editUser.is_active ?? true, // <-- Thêm
            });
        } else if (showModal) {
            // Reset form
            setFormData({
                email: "",
                username: "",
                password: "",
                ho_ten: "",
                sdt: "",
                m_s_n_v: "",
                cap: availableOptions[0]?.value || 0,
                PhongBanId: 0,
                is_active: true, // <-- Thêm (mặc định là active)
            });
        }
        setErrors({});
    }, [editUser, showModal, availableOptions]); // <-- Thêm availableOptions vào dependency

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target; // <-- Thêm type và checked

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "cap" || name === "PhongBanId"
                        ? Number(value) || 0
                        : value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username không được để trống";
        }

        if (!editUser && !formData.password.trim()) {
            newErrors.password = "Password không được để trống";
        }

        if (!formData.ho_ten.trim()) {
            newErrors.ho_ten = "Họ tên không được để trống";
        }

        if (!formData.sdt.trim()) {
            newErrors.sdt = "Số điện thoại không được để trống";
        }
        if (!formData.m_s_n_v.trim()) {
            newErrors.m_s_n_v = "Mã số nhân viên không được để trống";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (user?.cap === 1 && formData.cap === 0) {
            alert("Bạn không có quyền tạo tài khoản cấp 0");
            return;
        }
        const dataToSubmit = { ...formData };
        if (editUser && !dataToSubmit.password.trim()) {
            delete dataToSubmit.password;
        }
        await onSubmit(dataToSubmit);
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mb-0">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {editUser ? "Cập nhật tài khoản" : "Thêm tài khoản"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {editUser ? "Chỉnh sửa thông tin tài khoản" : "Tạo tài khoản người dùng mới"}
                    </p>
                </div>

                {/* Form */}
                <div className="px-4 sm:px-6 py-4 space-y-4 sm:space-y-5">
                    {/* Mã số nhân viên */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Hash className="w-4 h-4 text-gray-500" />
                            Mã số nhân viên
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="m_s_n_v"
                            value={formData.m_s_n_v}
                            onChange={handleChange}
                            placeholder="Nhập mã số nhân viên"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${errors.m_s_n_v // <-- Sửa lỗi: dùng m_s_n_v
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            required
                        />
                        {errors.m_s_n_v && ( // <-- Sửa lỗi: dùng m_s_n_v
                            <p className="text-red-500 text-xs">{errors.m_s_n_v}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Mail className="w-4 h-4 text-gray-500" />
                            Email
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${errors.username
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4 text-gray-500" />
                            Username
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập username"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${errors.username
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            required
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs">{errors.username}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Lock className="w-4 h-4 text-gray-500" />
                            Password
                            {!editUser && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={editUser ? "Để trống nếu không đổi" : "Nhập password"}
                                className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${errors.password
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                required={!editUser}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs">{errors.password}</p>
                        )}
                    </div>

                    {/* Họ tên */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4 text-gray-500" />
                            Họ tên
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ho_ten"
                            value={formData.ho_ten}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${errors.ho_ten
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            required
                        />
                        {errors.ho_ten && (
                            <p className="text-red-500 text-xs">{errors.ho_ten}</p>
                        )}
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Phone className="w-4 h-4 text-gray-500" />
                            Số điện thoại
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="sdt"
                            value={formData.sdt}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${errors.sdt
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            required
                        />
                        {errors.sdt && (
                            <p className="text-red-500 text-xs">{errors.sdt}</p>
                        )}
                    </div>

                    {/* ----- MỚI: Thêm Trạng thái ----- */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Activity className="w-4 h-4 text-gray-500" />
                            Trạng thái
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="is_active"
                                className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${formData.is_active
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.is_active
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                        }`}
                                />
                            </label>
                            <span className="text-sm text-gray-700">
                                {formData.is_active
                                    ? "Đang kích hoạt"
                                    : "Vô hiệu hóa"}
                            </span>
                        </div>
                    </div>


                    {/* Two column layout for Cap and Phong ban on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Cấp */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Hash className="w-4 h-4 text-gray-500" />
                                Cấp
                            </label>
                            <select
                                name="cap"
                                value={formData.cap}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                {availableOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Phòng ban */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Building className="w-4 h-4 text-gray-500" />
                                Phòng ban
                            </label>
                            <select
                                name="PhongBanId" // <-- Thêm name để handleChange có thể dùng
                                value={formData.PhongBanId} // <-- Đã có trong state
                                onChange={handleChange} // <-- Dùng handleChange chung
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                <option value={0}>-- Chọn phòng ban --</option>
                                {phong_ban?.map((pb) => (
                                    <option key={pb.id} value={pb.id}>
                                        {pb.ten}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-4 rounded-b-xl border-t border-gray-200">
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
                        >
                            {editUser ? "Cập nhật" : "Thêm tài khoản"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}