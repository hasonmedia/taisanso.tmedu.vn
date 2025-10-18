const MailService = require("../services/nhan_mail");

class MailController {
  // POST /mails - tạo mail nhận mới
  static async saveMail(req, res) {
    try {
      const { recipients } = req.body;
      console.log("controller" , recipients)
      const result = await MailService.saveRecipients(recipients);

      res.json({
        success: true,
        message: 'Danh sách người nhận đã được lưu thành công',
        data: result
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /mails - lấy tất cả mail nhận
  static async getAllMails(req, res) {
    try {
      const mails = await MailService.getAllMails();
      res.json({ success: true, data: mails });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = MailController;
