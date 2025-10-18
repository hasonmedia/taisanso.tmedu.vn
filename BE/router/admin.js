const { authentication, requireRole } = require("../middleware/auth.js");
const adminRouter = require("express").Router();
const { postYeuCau, patchYeuCau, getYeuCau } = require("../controller/yeu_cau");
const { getUsers } = require("../controller/tai_khoan");
const {postThongTinDangNhapTaiSan, patchThongTinDangNhapTaiSan, getThongTinTaiSan, getThongTinDangNhapTaiSan, thongBaoHetHan} = require("../controller/thong_tin_dang_nhap_tai_san.js");
const {getMe} = require("../controller/tai_khoan");
const phongban = require("../controller/phong_ban");
const hanhDongController = require("../controller/hanh_dong");
const DanhMucTaiSan = require("../controller/danh_muc_tai_san.js");
const taiSanController = require("../controller/tai_san.js");
const { getThongBao, addThongBao } = require("../controller/thong_bao.js");
const { mailThongBaoHetHanController, mailThongBaoTaiSanHetHanController } = require("../controller/configMail.js")
const MailController = require("../controller/nhan_mail.js");

adminRouter.get("/mails", authentication, requireRole(1), MailController.getAllMails);
adminRouter.put("/mails", authentication, requireRole(1), MailController.saveMail);

adminRouter.patch("/yeu_cau/:id", authentication, requireRole(2), patchYeuCau);
adminRouter.post("/yeu_cau", authentication, requireRole(2), postYeuCau);
adminRouter.get("/yeu_cau", authentication, requireRole(2), getYeuCau);

adminRouter.post("/thong_tin_tai_san", authentication, requireRole(2), postThongTinDangNhapTaiSan);
adminRouter.patch("/thong_tin_tai_san/:id", authentication, requireRole(3), patchThongTinDangNhapTaiSan);
//Xem thông tin tài sản cá nhân
adminRouter.get("/thong_tin_tai_san", authentication, requireRole(3), getThongTinTaiSan);
//Xem tat ca
adminRouter.get("/v1/thong_tin_tai_san", authentication, requireRole(2), getThongTinDangNhapTaiSan);

adminRouter.get("/thong_bao_het_han", authentication, requireRole(1), thongBaoHetHan);
adminRouter.get("/gui-mail", mailThongBaoHetHanController);
adminRouter.get("/gui-mail-tai-san-het-han", mailThongBaoTaiSanHetHanController);
adminRouter.get("/hanh_dong", authentication, requireRole(1), hanhDongController.getHanhDong);
adminRouter.get("/user/hanh_dong", authentication, requireRole(1), hanhDongController.getHanhDongById );

adminRouter.get("/tai-khoan", authentication, requireRole(3), getUsers);

//CRUD phòng ban
adminRouter.get("/phong_ban", authentication, requireRole(3), phongban.getPhongBan);
adminRouter.post("/phong_ban", authentication, requireRole(1), phongban.addPhongBan);
adminRouter.patch("/phong_ban/:id", authentication, requireRole(1), phongban.updatePhongBan);
adminRouter.delete("/phong_ban/:id", authentication, requireRole(1), phongban.deletePhongBan);

// CRUD danh mục tài sản
adminRouter.get("/danh_muc_tai_san", authentication, requireRole(3), DanhMucTaiSan.getAllDanhMucTaiSan);
adminRouter.post("/danh_muc_tai_san", authentication, requireRole(1), DanhMucTaiSan.addDanhMucTaiSan);
adminRouter.patch("/danh_muc_tai_san/:id", authentication, requireRole(1), DanhMucTaiSan.updateDanhMucTaiSan);
adminRouter.delete("/danh_muc_tai_san/:id", authentication, requireRole(1), DanhMucTaiSan.deleteDanhMucTaiSan);

//CRUD tài sản
adminRouter.get("/tai_san", authentication, requireRole(3), taiSanController.getTaiSan);
adminRouter.post("/tai_san", authentication, requireRole(1), taiSanController.addTaiSan);
adminRouter.patch("/tai_san/:id", authentication, requireRole(1), taiSanController.updateTaiSan);
adminRouter.delete("/tai_san/:id", authentication, requireRole(1), taiSanController.deleteTaiSan);
adminRouter.get("/tai_san_sap_het_han", authentication, requireRole(2), taiSanController.getTaiSanSapHetHan);


//Thông báo
adminRouter.get("/thong_bao", authentication, requireRole(3), getThongBao);
adminRouter.post("/thong_bao", authentication, requireRole(2), addThongBao);

adminRouter.get("/me", authentication, requireRole(3), getMe);

module.exports = adminRouter;