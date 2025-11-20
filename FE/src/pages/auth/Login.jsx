import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SSOLogin from "../../components/SSOLogin";
// Import icon cho SSO (giả định sử dụng React Icons, ví dụ: FaGoogle)
import { FaExternalLinkAlt } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  // Giả định AuthContext có thêm loginWithSSO
  const { login, loginWithSSO, loading } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [ssoEmail, setSsoEmail] = useState("");
  // 1. Thêm state để quản lý thông báo
  const [notification, setNotification] = useState({ message: "", type: "" }); // type: 'success' hoặc 'error'

  const handleRedirectByRole = (role) => {
    switch (role) {
      case 0: // Root
        navigate("/root/dashboard");
        break;
      case 1: // Admin
        navigate("/dashboard");
        break;
      case 2: // Manager
        navigate("/dashboard_manager");
        break;
      case 3: // User
        navigate("/user");
        break;
      default:
        navigate("/login");
        break;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Xóa thông báo cũ khi submit
    setNotification({ message: "", type: "" });
    try {
      // ⚠️ Đảm bảo hàm login trả về đối tượng có thuộc tính user.cap
      const data = await login(credentials);
      const role = data.user.cap;

      // 2. Thay vì alert, set state thông báo thành công
      setNotification({ message: "Đăng nhập thành công 🎉", type: "success" });

      // Thêm một khoảng trễ nhỏ để người dùng kịp thấy thông báo trước khi chuyển trang
      setTimeout(() => {
        handleRedirectByRole(role);
      }, 1500); // 1.5 giây

    } catch (err) {
      // 3. Thay vì alert, set state thông báo lỗi
      setNotification({
        message: err.message || "Đăng nhập thất bại",
        type: "error",
      });
      console.error("Login failed:", err);
    }
  };

  const handleSSOLogin = async () => {
    setNotification({ message: "", type: "" });

    if (!ssoEmail.includes('@')) {
      setNotification({
        message: "Vui lòng nhập email công ty hợp lệ để dùng SSO.",
        type: "error",
      });
      return;
    }

    try {
      // ⚠️ Gửi email đến Backend để khởi tạo luồng SSO (IdP Discovery)
      await loginWithSSO(ssoEmail);

      // Lưu ý: Nếu loginWithSSO thành công, Backend của bạn sẽ gửi lệnh 
      // Redirect (HTTP 302) và trình duyệt sẽ tự động chuyển trang.
      // Dòng code dưới đây chỉ chạy nếu API gọi bị lỗi hoặc trả về JSON (không phải redirect).

      // Nếu BE không redirect, bạn có thể xử lý thành công như sau (ít phổ biến):
      // const role = data.user.cap;
      // setNotification({ message: "Đăng nhập SSO thành công 🎉", type: "success" });
      // setTimeout(() => { handleRedirectByRole(role); }, 1500);

    } catch (err) {
      // Bắt lỗi nếu Backend không tìm thấy kết nối SSO cho domain này hoặc lỗi server
      setNotification({
        message: err.message || "Không thể khởi tạo SSO. Vui lòng kiểm tra email.",
        type: "error",
      });
      console.error("SSO Login failed:", err);
    }
  };
  // 4. (UX Cải tiến) Hàm xử lý khi gõ input, sẽ xóa thông báo lỗi/thành công
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'ssoEmail') {
      setSsoEmail(value.trim());
    }
    else {
      setCredentials({ ...credentials, [id]: value.trim() });
    }
    // Nếu đang có thông báo, hãy xóa nó đi khi người dùng bắt đầu gõ lại
    if (notification.message) {
      setNotification({ message: "", type: "" });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 flex flex-col space-y-4 transform transition-all hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Đăng nhập
        </h2>

        {/* --- Form Đăng nhập thường --- */}

        <input
          id="username"
          type="text"
          value={credentials.username}
          onChange={handleChange} // Sử dụng hàm handleChange mới
          placeholder="Tên đăng nhập"
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          id="password"
          type="password"
          value={credentials.password}
          onChange={handleChange} // Sử dụng hàm handleChange mới
          placeholder="Mật khẩu"
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* 5. Vị trí hiển thị thông báo (ngay trên nút đăng nhập) */}
        {notification.message && (
          <div
            className={`p-3 rounded-lg text-center font-medium ${notification.type === 'success'
              ? 'bg-green-100 text-green-700' // Style cho thành công
              : 'bg-red-100 text-red-700'     // Style cho lỗi
              }`}
          >
            {notification.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all 
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </form>

      {/* SSO Login Component */}
      {/* <SSOLogin /> */}
    </div>
  );
}