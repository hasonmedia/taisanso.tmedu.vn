const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const smtpPort = parseInt(process.env.SMPT_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: smtpPort,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    secure: smtpPort === 465, // auto-detect secure
    tls: {
      rejectUnauthorized: false,
      ciphers: "SSLv3",
    },
    // Tăng timeout và thêm retry logic
    connectionTimeout: 60000, // 60 giây
    greetingTimeout: 30000, // 30 giây
    socketTimeout: 60000, // 60 giây
    // Connection pool để tái sử dụng
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
    // Rate limiting
    rateDelta: 20000, // 20 giây
    rateLimit: 5, // 5 emails per rateDelta
  });
  const expiry = new Date(options.expiryDate).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  let data_html = "";
  if (options.email_nv) {
    data_html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #d9534f;">⚠️ Thông báo hết hạn tài sản</h2>
                <p>Kính gửi <b>${options.ten_quan_ly}</b>,</p>
                <p>Tài sản dưới đây sắp hết hạn sử dụng:</p>

                <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><b>Tên nhân viên</b></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${options.ten_nhan_vien}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><b>Email nhân viên</b></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${options.email_nv}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><b>Tài sản</b></td>
                        <td style="border: 1px solid #ddd; padding: 8px; color:#007bff;">${options.ten_tai_san}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><b>Nhà cung cấp</b></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${options.ten_nha_cung_cap}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><b>Ngày hết hạn</b></td>
                        <td style="border: 1px solid #ddd; padding: 8px; color:red;">${expiry}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><b>Số ngày còn lại</b></td>
                        <td style="border: 1px solid #ddd; padding: 8px; color:red;"><b>${options.so_ngay_con_lai}</b> ngày</td>
                    </tr>
                </table>

                <p style="margin-top: 15px;">Vui lòng kiểm tra và gia hạn nếu cần thiết để tránh gián đoạn sử dụng.</p>
                <p>Trân trọng,<br/>Phòng Quản lý tài sản</p>
                <hr/>
                <p style="font-size: 12px; color: #666;">
                    Đây là email tự động, vui lòng không trả lời.
                </p>
            </div>
        `;
  } else if (options.email_ql) {
    data_html = options.html;
  } else if (options.email_forgot) {
    data_html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #d9534f;">🔐 Yêu cầu đặt lại mật khẩu</h2>
                <p>Xin chào <b>${options.name}</b>,</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu:</p>
                <p><a href="${options.resetLink}" style="color: #007bff;">Đặt lại mật khẩu</a></p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p style="margin-top: 20px;">Trân trọng,<br/>Phòng Hỗ trợ Kỹ thuật</p>
                <hr/>
                <p style="font-size: 12px; color: #666;">
                    Đây là email tự động, vui lòng không trả lời.
                </p>
            </div>
        `;
  } else {
    data_html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #d9534f;">⚠️ Thông báo hết hạn tài sản</h2>
                <p>Xin chào <b>${options.name}</b>,</p>
                <p>Tài sản <b style="color: #007bff;">${options.ten_tai_san}</b> 
                từ nhà cung cấp <b>${options.ten_nha_cung_cap}</b> 
                sẽ <b style="color: red;">hết hạn sau ${options.so_ngay_con_lai} ngày</b>.</p>
                
                <p><b>Ngày hết hạn:</b> ${expiry}</p>

                <p style="margin-top: 15px;">Vui lòng kiểm tra và gia hạn nếu cần thiết để tránh gián đoạn sử dụng.</p>
                
                <p style="margin-top: 20px;">Trân trọng,<br/>Phòng Quản lý tài sản</p>
                <hr/>
                <p style="font-size: 12px; color: #666;">
                    Đây là email tự động, vui lòng không trả lời.
                </p>
            </div>
        `;
  }
  let subject = "Thông báo hết hạn tài sản số";
  if (options.email_forgot) {
    subject = "Quên mật khẩu - Đặt lại mật khẩu";
  }

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: subject,
    html: data_html,
  };

  // Retry logic với exponential backoff
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[Attempt ${attempt}/${maxRetries}] Sending email to:`,
        options.email
      );

      if (attempt === 1) {
        console.log("SMTP Config:", {
          host: process.env.SMPT_HOST,
          port: smtpPort,
          service: process.env.SMPT_SERVICE,
          secure: smtpPort === 465,
          user: process.env.SMPT_MAIL ? "SET" : "NOT SET",
        });
      }

      // Verify connection trước khi gửi (chỉ lần đầu)
      if (attempt === 1) {
        console.log("Verifying SMTP connection...");
        await transporter.verify();
        console.log("SMTP connection verified successfully");
      }

      const startTime = Date.now();
      const result = await transporter.sendMail(mailOptions);
      const endTime = Date.now();

      console.log(`✅ Email sent successfully in ${endTime - startTime}ms`);
      console.log("Message ID:", result.messageId);

      // Đóng transporter sau khi thành công
      transporter.close();
      return result;
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, {
        code: error.code,
        command: error.command,
        message: error.message,
      });

      // Nếu không phải lần thử cuối, đợi trước khi retry
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000; // exponential backoff: 1s, 2s, 4s
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Đóng transporter khi fail
  transporter.close();

  // Nếu tất cả attempts đều fail
  console.error("All email attempts failed. Last error:", lastError);
  throw new Error(
    `Không thể gửi email sau ${maxRetries} lần thử: ${lastError.message}`
  );
};

module.exports = sendMail;
