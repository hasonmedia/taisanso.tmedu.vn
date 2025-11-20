const sendMail = require("../config/sendMail");
const { sequelize } = require("../config/database");
const MailService = require("../services/nhan_mail");
const { getTaiSanSapHetHan } = require("../services/tai_san");
const mailThongBaoHetHan = async () => {
  try {
    const sql = `SELECT
                        ttdn.id,
                        ttdn.thong_tin,
                        ttdn.ngay_cap,
                        ttdn.ngay_thu_hoi,
                        ttdn.trang_thai,
                        ts.ten_tai_san,
                        ts.id AS tai_san_id,
                        ncc.ten AS ten_nha_cung_cap,
                        pb.ten AS ten_phong_ban,
                        tk1.username AS mail_nguoi_nhan,
                        tk1.ho_ten AS ho_ten_nguoi_nhan,
                        tk2.ho_ten AS ho_ten_nguoi_dai_dien,
                        tk2.username AS mail_nguoi_dai_dien,
                        EXTRACT(DAY FROM (ttdn.ngay_thu_hoi - NOW())) AS so_ngay_con_lai
                    FROM 
                        thong_tin_dang_nhap_tai_san ttdn
                    JOIN
                        tai_san ts ON ts.id = ttdn.tai_san_id
                    JOIN
                        nha_cung_cap ncc ON ncc.id = ts.nha_cung_cap_id
                    JOIN
                        tai_khoan tk1 ON tk1.id = ttdn.nguoi_nhan_id
                    JOIN
                        tai_khoan tk2 ON tk2.id = ttdn.nguoi_dai_dien_id
                    JOIN
                        phong_ban pb ON tk1.phong_ban_id = pb.id
                    WHERE 
                        EXTRACT(DAY FROM (ttdn.ngay_thu_hoi - NOW())) IN (30, 10, 3, 0, -3);
                    `;

    const data = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
    const recipients = await MailService.getAllMails();
    if (data.length > 0 && recipients.length > 0) {
      const html = generateHtmlForManager(data);
      for (const m of recipients) {
        const email = m.dataValues?.email || m.email;
        await sendMail({
          email,
          email_ql: email,
          name: "Quản lý",
          html,
        });
      }
    }
    for (const row of data) {
      await sendMail({
        email: row.mail_nguoi_nhan,
        name: row.ho_ten_nguoi_nhan,
        expiryDate: row.ngay_thu_hoi,
        ten_nha_cung_cap: row.ten_nha_cung_cap,
        ten_tai_san: row.ten_tai_san,
        so_ngay_con_lai: row.so_ngay_con_lai,
      });

      await sendMail({
        email: row.mail_nguoi_dai_dien,
        email_nv: row.mail_nguoi_nhan,
        ten_quan_ly: row.ho_ten_nguoi_dai_dien,
        ten_nhan_vien: row.ho_ten_nguoi_nhan,
        expiryDate: row.ngay_thu_hoi,
        ten_nha_cung_cap: row.ten_nha_cung_cap,
        ten_tai_san: row.ten_tai_san,
        so_ngay_con_lai: row.so_ngay_con_lai,
      });
    }
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
const generateHtmlForManager = (data) => {
  let rows = "";
  data.forEach((row, index) => {
    const expiry = new Date(row.ngay_thu_hoi).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    rows += `
        <tr style="border-bottom:1px solid #ddd;">
            <td style="padding: 8px;">${index + 1}</td>
            <td style="padding: 8px;">${row.ten_tai_san}</td>
            <td style="padding: 8px;">${row.ten_nha_cung_cap}</td>
            <td style="padding: 8px;">${row.ho_ten_nguoi_nhan}</td>
            <td style="padding: 8px;">${expiry}</td>
            <td style="padding: 8px; color:red;"><b>${
              row.so_ngay_con_lai
            }</b></td>
        </tr>
        `;
  });

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #d9534f;">⚠️ Thông báo tài sản sắp hết hạn</h2>
        <p>Kính gửi <b>Quản lý cấp cao</b>,</p>
        <p>Dưới đây là danh sách tất cả tài sản sắp hết hạn trong 7 ngày tới:</p>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px;">STT</th>
                    <th style="padding: 8px;">Tên tài sản</th>
                    <th style="padding: 8px;">Nhà cung cấp</th>
                    <th style="padding: 8px;">Người nhận</th>
                    <th style="padding: 8px;">Ngày hết hạn</th>
                    <th style="padding: 8px;">Số ngày còn lại</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <p style="margin-top: 15px;">Vui lòng kiểm tra và yêu cầu gia hạn nếu cần thiết.</p>
        <p>Trân trọng,<br/>Phòng Quản lý tài sản</p>
        <hr/>
        <p style="font-size: 12px; color: #666;">Đây là email tự động, vui lòng không trả lời.</p>
    </div>
    `;
};

const generateHtmlForAssetExpiry = (data) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Không có";
    return new Date(dateString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const generateAssetRows = (assets, rowClass = "") => {
    return assets
      .map(
        (asset, index) => `
            <tr style="border-bottom:1px solid #ddd; ${rowClass}">
                <td style="padding: 8px; text-align: center;">${index + 1}</td>
                <td style="padding: 8px; font-weight: bold;">${
                  asset.ten_tai_san
                }</td>
                <td style="padding: 8px;">${asset.danh_muc_tai_san_ten}</td>
                <td style="padding: 8px;">${
                  asset.ten_nha_cung_cap || "Không có"
                }</td>
                <td style="padding: 8px; text-align: center;">${formatDate(
                  asset.ngay_dang_ky
                )}</td>
                <td style="padding: 8px; text-align: center; font-weight: bold;">${formatDate(
                  asset.ngay_het_han
                )}</td>
                <td style="padding: 8px; text-align: center; font-weight: bold; color: ${
                  asset.so_ngay_con_lai <= 3
                    ? "#dc3545"
                    : asset.so_ngay_con_lai <= 7
                    ? "#ffc107"
                    : "#007bff"
                };">${asset.so_ngay_con_lai} ngày</td>
            </tr>
        `
      )
      .join("");
  };

  const criticalRows =
    data.critical.count > 0
      ? generateAssetRows(data.critical.assets, "background-color: #f8d7da;")
      : "";
  const warningRows =
    data.warning.count > 0
      ? generateAssetRows(data.warning.assets, "background-color: #fff3cd;")
      : "";
  const noticeRows =
    data.notice.count > 0
      ? generateAssetRows(data.notice.assets, "background-color: #d1ecf1;")
      : "";

  const summaryStats = `
        <div style="display: flex; gap: 15px; margin: 20px 0; flex-wrap: wrap;">
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; flex: 1; min-width: 200px;">
                <h4 style="margin: 0; color: #721c24;">🚨 Khẩn cấp (≤ 3 ngày)</h4>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #dc3545;">${data.critical.count}</p>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; flex: 1; min-width: 200px;">
                <h4 style="margin: 0; color: #856404;">⚠️ Cảnh báo (4-7 ngày)</h4>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #ffc107;">${data.warning.count}</p>
            </div>
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff; flex: 1; min-width: 200px;">
                <h4 style="margin: 0; color: #0c5460;">ℹ️ Thông báo (8-10 ngày)</h4>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #007bff;">${data.notice.count}</p>
            </div>
        </div>
    `;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">📋 BÁO CÁO TÀI SẢN SẮP HẾT HẠN</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hệ thống quản lý tài sản số</p>
        </div>

        <!-- Content -->
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-bottom: 20px;">Kính gửi <strong>Ban Lãnh đạo</strong>,</p>
            
            <p style="margin-bottom: 25px;">
                Hệ thống đã phát hiện <strong style="color: #dc3545;">${
                  data.total
                } tài sản</strong> sắp hết hạn trong vòng 10 ngày tới. 
                Dưới đây là báo cáo chi tiết theo mức độ ưu tiên:
            </p>

            <!-- Summary Statistics -->
            ${summaryStats}

            ${
              data.total > 0
                ? `
            <!-- Detailed Table -->
            <div style="margin-top: 30px;">
                <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📊 Danh sách chi tiết</h3>
                
                <div style="overflow-x: auto; margin-top: 20px;">
                    <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                                <th style="padding: 12px 8px; text-align: center; font-weight: bold;">STT</th>
                                <th style="padding: 12px 8px; text-align: left; font-weight: bold;">Tên tài sản</th>
                                <th style="padding: 12px 8px; text-align: left; font-weight: bold;">Danh mục</th>
                                <th style="padding: 12px 8px; text-align: left; font-weight: bold;">Nhà cung cấp</th>
                                <th style="padding: 12px 8px; text-align: center; font-weight: bold;">Ngày đăng ký</th>
                                <th style="padding: 12px 8px; text-align: center; font-weight: bold;">Ngày hết hạn</th>
                                <th style="padding: 12px 8px; text-align: center; font-weight: bold;">Còn lại</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${criticalRows}
                            ${warningRows}
                            ${noticeRows}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Legend -->
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🎨 Chú thích màu sắc:</h4>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <span style="padding: 5px 10px; background: #f8d7da; border-radius: 4px; font-size: 14px;">🚨 Khẩn cấp: ≤ 3 ngày</span>
                    <span style="padding: 5px 10px; background: #fff3cd; border-radius: 4px; font-size: 14px;">⚠️ Cảnh báo: 4-7 ngày</span>
                    <span style="padding: 5px 10px; background: #d1ecf1; border-radius: 4px; font-size: 14px;">ℹ️ Thông báo: 8-10 ngày</span>
                </div>
            </div>

            <!-- Action Required -->
            <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-left: 5px solid #ffc107; border-radius: 0 8px 8px 0;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">📋 Hành động cần thực hiện:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #856404;">
                    <li>Kiểm tra và xác nhận tình trạng các tài sản khẩn cấp</li>
                    <li>Liên hệ với các nhà cung cấp để gia hạn hoặc thay thế</li>
                    <li>Cập nhật thông tin tài sản trong hệ thống</li>
                    <li>Thông báo cho các phòng ban liên quan</li>
                </ul>
            </div>
            `
                : `
            <!-- No Assets Expiring -->
            <div style="text-align: center; padding: 40px; background: #d4edda; border-radius: 8px; border: 1px solid #c3e6cb;">
                <h3 style="color: #155724; margin: 0 0 10px 0;">✅ Tất cả tài sản đều còn hạn sử dụng</h3>
                <p style="color: #155724; margin: 0;">Hiện tại không có tài sản nào sắp hết hạn trong 10 ngày tới.</p>
            </div>
            `
            }

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="margin: 0; color: #666;">
                    Trân trọng,<br/>
                    <strong>Hệ thống Quản lý Tài sản Số</strong><br/>
                    <em>Ngày tạo: ${new Date().toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}</em>
                </p>
            </div>
        </div>

        <!-- Disclaimer -->
        <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 0 0 10px 10px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
                📧 Đây là email tự động từ hệ thống. Vui lòng không trả lời email này.<br/>
                Nếu có thắc mắc, vui lòng liên hệ bộ phận IT hoặc quản lý tài sản.
            </p>
        </div>
    </div>
    `;
};
const mailThongBaoTaiSanHetHan = async () => {
  try {
    // Gọi API getTaiSanSapHetHan từ services/tai_san.js
    const expiryData = await getTaiSanSapHetHan({ hanh_dong: "system" });

    // Lấy danh sách email đã cấu hình
    const recipients = await MailService.getAllMails();

    if (expiryData.total > 0 && recipients.length > 0) {
      const html = generateHtmlForAssetExpiry(expiryData);

      for (const recipient of recipients) {
        const email = recipient.dataValues?.email || recipient.email;
        await sendMail({
          email,
          name: "Quản lý",
          subject: "Cảnh báo tài sản sắp hết hạn",
          html,
        });
      }
    }

    return expiryData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
module.exports = { mailThongBaoHetHan, mailThongBaoTaiSanHetHan };
