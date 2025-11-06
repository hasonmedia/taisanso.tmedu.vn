const mailThongBaoHetHan = require("../services/configMail")
const mailThongBaoTaiSanHetHan = require("../services/configMail")
const mailThongBaoHetHanController = async (req, res) => {
    const value = await mailThongBaoHetHan();

    if (value == "error") {
        res.status(505).json("Lỗi hệ thống");
    } else {
        res.status(201).json({
            status: true,
            message: "Gửi mail thành công thông báo hết hạn"
        });
    }
};

const mailThongBaoTaiSanHetHanController = async (req, res) => {
    const value = await mailThongBaoTaiSanHetHan();
    if (value == "error") {
        res.status(505).json("Lỗi hệ thống");
    } else {
        res.status(201).json({
            status: true,
            message: "Gửi mail thành công thông báo tài sản hết hạn"
        });
    }
};
module.exports = {mailThongBaoHetHanController, mailThongBaoTaiSanHetHanController};