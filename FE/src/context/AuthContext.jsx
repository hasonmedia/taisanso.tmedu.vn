import { createContext, useContext, useState, useEffect } from "react";
import axiosCofig from "../axiosConfig";
import { logout as logoutService } from "../apis/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start true
  const [error, setError] = useState(null);
  const fetchUser = async () => {
    try {
      const res = await axiosCofig.get("/admin/me");
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchUser();
  }, []);
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // BE trả 200: thành công
      const data = await axiosCofig.post("/auth/login", credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      // BE trả 404, 403... axios tự động ném lỗi
      // err.response.data.message sẽ là "Không tìm thấy email", "Sai mật khẩu", v.v.
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // AuthContext.js (Frontend)
  const loginWithSSO = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosCofig.post("/sso/initiate", { email: email });
      console.log("SSO Initiation Response:", response);
      // Nếu BE trả về JSON {url: ...}, bạn sẽ chuyển hướng thủ công:
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
      console.log("Đang chuyển hướng đến trang SSO...");

      // **KHÔNG** có dòng nào chạy sau lệnh chuyển hướng
      // (hoặc sau khi trình duyệt nhận được 302 Redirect)

      // Nếu không có lỗi, cứ để nó chạy, trình duyệt sẽ tự động chuyển hướng đi.
      // Nếu bạn muốn hàm này trả về một điều gì đó để tránh lỗi linter, hãy trả về true
      return true;
    }
    catch (err) {
      // Lỗi xảy ra NẾU API /sso/initiate thất bại (ví dụ: email không hợp lệ, 500 server error)
      setError(err.response?.data?.message || "Khởi tạo SSO thất bại");
      throw err;
    }
    finally {
      // Bạn cần cẩn thận với finally, vì trình duyệt sẽ rời khỏi trang trước khi nó chạy
      // Chỉ set false nếu bạn chắc chắn API call bị lỗi.
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutService();
      setUser(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const exchangeSsoCode = async (code) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Gửi mã code lên endpoint POST mới của Backend
      const response = await axiosCofig.get("/sso/callback", { code });

      if (response.data.success) {
        const userData = response.data.user;

        // 2. Lưu thông tin người dùng vào Context hoặc Local Storage
        setUser(userData);
        // setToken(response.data.token); 

        return response.data; // Trả về toàn bộ data để component callback xử lý
      }

      throw new Error(response.data.message || "Phản hồi xác thực không hợp lệ.");

    } catch (err) {
      // Lỗi từ server hoặc axios
      setError(err.response?.data?.message || "Trao đổi mã SSO thất bại.");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, login, loginWithSSO, exchangeSsoCode, handleLogout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
