const nhan_mail = require("../model/nhan_mail");
const { sequelize } = require("../config/database");
class MailService {
  static async saveRecipients(recipients) {
    const recipient = recipients.recipients;
    console.log(recipient)
    if (!Array.isArray(recipient)) {
      throw { status: 400, message: 'Recipients phải là một mảng' };
    }

    // Transaction Sequelize
    const t = await sequelize.transaction();
    try {
      // Xóa tất cả recipients cũ
      await nhan_mail.destroy({ where: {}, transaction: t });
      // Thêm recipients mới
      if (recipient.length > 0) {
        const recipientsData = recipient.map(r => ({ id: r.id, email: r.email }));
        await nhan_mail.bulkCreate(recipientsData, { transaction: t });
      }

      await t.commit();
      return { count: recipient.length };

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getAllMails() {
    return await nhan_mail.findAll();
  }
}

module.exports = MailService;
