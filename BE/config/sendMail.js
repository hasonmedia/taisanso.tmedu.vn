const nodemailer = require("nodemailer");


const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        // service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
        secure: false
    });
    const expiry = new Date(options.expiryDate).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
    let data_html=''
    if (options.email_nv) {
        console.log("nv ", options.email_nv)
        data_html =  `
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
        `
    }
    else if (options.email_ql) {
        console.log("ql ", options.email_ql);
        data_html = options.html
    }
    else 
    {
        console.log("email ", options.email)
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
        `
    }
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: "Thông báo hết hạn tài sản số",
        html: data_html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;