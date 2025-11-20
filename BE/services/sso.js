const workosConfig = require("../config/ssoConfig"); // Điều chỉnh đường dẫn theo vị trí thực tế của bạn
const { workos, clientId, redirectUri } = workosConfig;
const { TaiKhoan } = require("../model/tai_khoan");
/**
 * Tạo URL ủy quyền (Authorization URL) của WorkOS.
 * @param {string} email - Email của người dùng.
 * @returns {string} - URL chuyển hướng đến IdP.
 */
const initiateSsoLogin = async (email) => {
  if (!email) {
    throw new Error("Email là bắt buộc.");
  }

  const domain = email.split("@")[1];
  if (!domain) {
    throw new Error("Email không hợp lệ.");
  }

  const authorizationUrl = workos.sso.getAuthorizationUrl({
    connection: "conn_01KA90MMZETCJCHXTV4KQBC639", // Thay thế bằng Connection ID của bạn
    clientId: clientId, // Thay thế bằng Client ID của bạn
    redirectUri: redirectUri,
    state: "dj1kUXc0dzlXZ1hjUQ==", // Thay đổi state thành giá trị ngẫu nhiên trong thực tế
  });

  return authorizationUrl;
};

/**
 * Xử lý callback từ WorkOS, đổi code lấy profile người dùng.
 * @param {string} code - Mã xác thực nhận được từ WorkOS.
 * @returns {object} - Profile người dùng từ WorkOS.
 */
const handleSsoCallback = async (code) => {
  if (!code) {
    throw new Error("Không tìm thấy mã xác thực (code).");
  }

  const { profile } = await workos.sso.getProfileAndToken({
    code,
    clientId: workosConfig.clientId,
  });
  console.log("WorkOS Profile nhận được:", profile);
  let user = await TaiKhoan.findOne({ where: { email: profile.email } });
  if (!user) {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(profile.email, 10);

    user = await TaiKhoan.create({
      m_s_n_v: null,
      email: profile.email,
      username: profile.email,
      password: hashedPassword,
      ho_ten: profile.firstName + " " + profile.lastName,
      sdt: profile.email || "N/A",
      phong_ban_id: 1,
      cap: 3, // Mặc định là User
    });
  }
  // TODO: Tại đây, bạn s ẽ gọi hàm để tạo/cập nhật user trong CSDL của bạn
  // Ví dụ: const internalUser = await userRepository.findOrCreate(profile.email, profile);
  // Sau đó trả về user đã được xử lý của bạn

  return {
    email: user.email,
    ho_ten: user.ho_ten,
    cap: user.cap,
    id: user.id,
  };
};

module.exports = {
  initiateSsoLogin,
  handleSsoCallback,
};
