const { authentication, requireRole } = require("../middleware/auth.js");
const adminRouter = require("express").Router();
const { postYeuCau, patchYeuCau, getYeuCau } = require("../controller/yeu_cau");
const { getUsers } = require("../controller/tai_khoan");
const {
  postThongTinDangNhapTaiSan,
  patchThongTinDangNhapTaiSan,
  getThongTinTaiSan,
  getThongTinDangNhapTaiSan,
  thongBaoHetHan,
} = require("../controller/thong_tin_dang_nhap_tai_san.js");
const { getMe } = require("../controller/tai_khoan");
const phongban = require("../controller/phong_ban");
const hanhDongController = require("../controller/hanh_dong");
const DanhMucTaiSan = require("../controller/danh_muc_tai_san.js");
const taiSanController = require("../controller/tai_san.js");
const { getThongBao, addThongBao } = require("../controller/thong_bao.js");
const {
  mailThongBaoHetHanController,
  mailThongBaoTaiSanHetHanController,
} = require("../controller/configMail.js");
const MailController = require("../controller/nhan_mail.js");
const {
  getNhaCungCapController,
  addNhaCungCapController,
  updateNhaCungCapController,
  deleteNhaCungCapController,
} = require("../controller/nha_cung_cap.js");
const {
  getLoaiTaiSanController,
  getAllLoaiTaiSanController,
  addLoaiTaiSanController,
  updateLoaiTaiSanController,
  deleteLoaiTaiSanController,
} = require("../controller/loai_tai_san.js");
/**
 * @swagger
 * tags:
 *   - name: Yêu Cầu
 *     description: API quản lý yêu cầu
 *   - name: Tài Sản
 *     description: API quản lý tài sản
 *   - name: Danh Mục Tài Sản
 *     description: API quản lý danh mục tài sản
 *   - name: Nhà Cung Cấp
 *     description: API nhà cung cấp
 *   - name: Phòng Ban
 *     description: API quản lý phòng ban
 *   - name: Tài Khoản
 *     description: API người dùng
 *   - name: Thông Báo
 *     description: Gửi & quản lý thông báo
 *   - name: Mail
 *     description: Cấu hình và gửi email
 *   - name: Hành Động
 *     description: Lịch sử hành động
 *   - name: Thông Tin Đăng Nhập Tài Sản
 *     description: API thông tin đăng nhập tài sản
 *   - name: Loại Tài Sản
 *     description: API quản lý loại tài sản
 */

/**
 * @swagger
 * /api/admin/mails:
 *   get:
 *     summary: Lấy danh sách cấu hình email
 *     tags: [Mail]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *   put:
 *     summary: Lưu cấu hình email
 *     tags: [Mail]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_config:
 *                 type: object
 *     responses:
 *       200:
 *         description: Lưu cấu hình thành công
 */

adminRouter.get(
  "/mails",
  authentication,
  requireRole(1),
  MailController.getAllMails
);
adminRouter.put(
  "/mails",
  authentication,
  requireRole(1),
  MailController.saveMail
);
/**
 * @swagger
 * /api/admin/yeu_cau:
 *   get:
 *     summary: Lấy danh sách yêu cầu
 *     tags: [Yêu Cầu]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: trang_thai
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/YeuCau'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *                     total_records:
 *                       type: integer
 *       401:
 *         description: Chưa đăng nhập
 *   post:
 *     summary: Tạo yêu cầu mới
 *     tags: [Yêu Cầu]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loai_yeu_cau
 *               - tai_san_id
 *               - mo_ta
 *             properties:
 *               loai_yeu_cau:
 *                 type: string
 *                 example: "muon_tai_san"
 *                 description: "Loại yêu cầu: muon_tai_san, tra_tai_san, bao_hong, bao_mat"
 *               tai_san_id:
 *                 type: integer
 *                 example: 1
 *               mo_ta:
 *                 type: string
 *                 example: "Cần mượn laptop để làm việc tại nhà"
 *               ngay_bat_dau:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               ngay_ket_thuc:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-30"
 *               ghi_chu:
 *                 type: string
 *                 example: "Ghi chú thêm"
 *     responses:
 *       201:
 *         description: Tạo mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền
 */
adminRouter.post("/yeu_cau", authentication, requireRole(2), postYeuCau);
adminRouter.get("/yeu_cau", authentication, requireRole(2), getYeuCau);
/**
 * @swagger
 * /api/admin/yeu_cau/{id}:
 *   patch:
 *     summary: Cập nhật yêu cầu theo ID
 *     tags: [Yêu Cầu]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của yêu cầu cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trang_thai:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: "approved"
 *               ly_do_tu_choi:
 *                 type: string
 *                 example: "Không đủ điều kiện"
 *               ghi_chu_phe_duyet:
 *                 type: string
 *                 example: "Phê duyệt trong 3 ngày"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy yêu cầu
 */
adminRouter.patch("/yeu_cau/:id", authentication, requireRole(2), patchYeuCau);

/**
 * @swagger
 * /api/admin/thong_tin_tai_san:
 *   post:
 *     summary: Thêm thông tin đăng nhập tài sản
 *     tags: [Thông Tin Đăng Nhập Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tai_san_id
 *               - ten_dang_nhap
 *               - mat_khau
 *             properties:
 *               tai_san_id:
 *                 type: integer
 *                 example: 1
 *               ten_dang_nhap:
 *                 type: string
 *                 example: "admin_laptop"
 *               mat_khau:
 *                 type: string
 *                 example: "password123"
 *               mo_ta:
 *                 type: string
 *                 example: "Tài khoản admin của laptop"
 *               url_truy_cap:
 *                 type: string
 *                 example: "http://192.168.1.100"
 *               ngay_het_han:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Thêm thông tin thành công
 *       401:
 *         description: Không có quyền truy cập
 *   get:
 *     summary: Xem thông tin tài sản cá nhân
 *     tags: [Thông Tin Đăng Nhập Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: tai_san_id
 *         schema:
 *           type: integer
 *         description: ID tài sản cần xem
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       tai_san_id:
 *                         type: integer
 *                       ten_dang_nhap:
 *                         type: string
 *                       mo_ta:
 *                         type: string
 *                       url_truy_cap:
 *                         type: string
 *                       ngay_het_han:
 *                         type: string
 *                         format: date
 */
adminRouter.post(
  "/thong_tin_tai_san",
  authentication,
  requireRole(2),
  postThongTinDangNhapTaiSan
);

/**
 * @swagger
 * /api/admin/thong_tin_tai_san/{id}:
 *   patch:
 *     summary: Cập nhật thông tin đăng nhập tài sản
 *     tags: [Thông Tin Đăng Nhập Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID thông tin đăng nhập cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_dang_nhap:
 *                 type: string
 *               mat_khau:
 *                 type: string
 *               mo_ta:
 *                 type: string
 *               url_truy_cap:
 *                 type: string
 *               ngay_het_han:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thông tin
 */
adminRouter.patch(
  "/thong_tin_tai_san/:id",
  authentication,
  requireRole(3),
  patchThongTinDangNhapTaiSan
);
//Xem thông tin tài sản cá nhân
adminRouter.get(
  "/thong_tin_tai_san",
  authentication,
  requireRole(3),
  getThongTinTaiSan
);

/**
 * @swagger
 * /api/admin/v1/thong_tin_tai_san:
 *   get:
 *     summary: Xem tất cả thông tin đăng nhập tài sản (Admin)
 *     tags: [Thông Tin Đăng Nhập Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: tai_san_id
 *         schema:
 *           type: integer
 *         description: Lọc theo ID tài sản
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       tai_san_id:
 *                         type: integer
 *                       ten_dang_nhap:
 *                         type: string
 *                       mo_ta:
 *                         type: string
 *                       url_truy_cap:
 *                         type: string
 *                       ngay_het_han:
 *                         type: string
 *                         format: date
 *                       tai_san:
 *                         $ref: '#/components/schemas/TaiSan'
 */
//Xem tat ca
adminRouter.get(
  "/v1/thong_tin_tai_san",
  authentication,
  requireRole(2),
  getThongTinDangNhapTaiSan
);

/**
 * @swagger
 * /api/admin/thong_bao_het_han:
 *   get:
 *     summary: Lấy thông báo tài sản hết hạn
 *     tags: [Thông Báo]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     critical_assets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TaiSan'
 *                     warning_assets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TaiSan'
 */
adminRouter.get(
  "/thong_bao_het_han",
  authentication,
  requireRole(1),
  thongBaoHetHan
);

/**
 * @swagger
 * /api/admin/gui-mail:
 *   get:
 *     summary: Gửi mail thông báo hết hạn cá nhân
 *     tags: [Mail]
 *     description: Gửi email thông báo đến từng cá nhân về tài sản sắp hết hạn
 *     responses:
 *       200:
 *         description: Gửi mail thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Đã gửi mail thông báo thành công"
 *                 sent_count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Lỗi gửi mail
 */
adminRouter.get("/gui-mail", mailThongBaoHetHanController);

/**
 * @swagger
 * /api/admin/gui-mail-tai-san-het-han:
 *   get:
 *     summary: Gửi mail thông báo tài sản hết hạn (tổng hợp)
 *     tags: [Mail]
 *     description: Gửi email thông báo tổng hợp về tất cả tài sản hết hạn
 *     responses:
 *       200:
 *         description: Gửi mail thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Đã gửi mail thông báo tài sản hết hạn"
 *                 assets_count:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Lỗi gửi mail
 */
adminRouter.get(
  "/gui-mail-tai-san-het-han",
  mailThongBaoTaiSanHetHanController
);
/**
 * @swagger
 * /api/admin/hanh_dong:
 *   get:
 *     summary: Lấy lịch sử hành động của hệ thống
 *     tags: [Hành Động]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: nguoi_dung_id
 *         schema:
 *           type: integer
 *         description: Lọc theo ID người dùng
 *       - in: query
 *         name: loai_hanh_dong
 *         schema:
 *           type: string
 *         description: Lọc theo loại hành động
 *       - in: query
 *         name: tu_ngay
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc từ ngày
 *       - in: query
 *         name: den_ngay
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc đến ngày
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nguoi_dung_id:
 *                         type: integer
 *                       loai_hanh_dong:
 *                         type: string
 *                         example: "CREATE_ASSET"
 *                       mo_ta:
 *                         type: string
 *                         example: "Tạo tài sản mới: Laptop Dell"
 *                       thoi_gian:
 *                         type: string
 *                         format: date-time
 *                       ip_address:
 *                         type: string
 *                         example: "192.168.1.100"
 *                       user_agent:
 *                         type: string
 *                       du_lieu_cu:
 *                         type: object
 *                       du_lieu_moi:
 *                         type: object
 *                       tai_khoan:
 *                         type: object
 *                         properties:
 *                           ho_ten:
 *                             type: string
 *                           ten_dang_nhap:
 *                             type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *                     total_records:
 *                       type: integer
 *       401:
 *         description: Không có quyền truy cập
 */
adminRouter.get(
  "/hanh_dong",
  authentication,
  requireRole(1),
  hanhDongController.getHanhDong
);

/**
 * @swagger
 * /api/admin/user/hanh_dong:
 *   get:
 *     summary: Lấy lịch sử hành động theo user ID
 *     tags: [Hành Động]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của user cần xem lịch sử
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng bản ghi mỗi trang
 *     responses:
 *       200:
 *         description: Lấy lịch sử user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       loai_hanh_dong:
 *                         type: string
 *                       mo_ta:
 *                         type: string
 *                       thoi_gian:
 *                         type: string
 *                         format: date-time
 *                       ip_address:
 *                         type: string
 *       400:
 *         description: Thiếu user_id parameter
 *       401:
 *         description: Không có quyền truy cập
 */
adminRouter.get(
  "/user/hanh_dong",
  authentication,
  requireRole(1),
  hanhDongController.getHanhDongById
);

/**
 * @swagger
 * /api/admin/tai-khoan:
 *   get:
 *     summary: Lấy danh sách tất cả tài khoản
 *     tags: [Tài Khoản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: vai_tro
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *         description: Lọc theo vai trò (1=Root, 2=Manager, 3=User)
 *       - in: query
 *         name: phong_ban_id
 *         schema:
 *           type: integer
 *         description: Lọc theo phòng ban
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên hoặc email
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *                     total_records:
 *                       type: integer
 *       401:
 *         description: Không có quyền truy cập
 */
adminRouter.get("/tai-khoan", authentication, requireRole(3), getUsers);

//CRUD phòng ban
/**
 * @swagger
 * /api/admin/phong_ban:
 *   get:
 *     summary: Lấy danh sách phòng ban
 *     tags: [Phòng Ban]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PhongBan'
 *   post:
 *     summary: Thêm phòng ban mới
 *     tags: [Phòng Ban]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_phong_ban
 *             properties:
 *               ten_phong_ban:
 *                 type: string
 *                 example: "Phòng IT"
 *               mo_ta:
 *                 type: string
 *                 example: "Phòng công nghệ thông tin"
 *     responses:
 *       201:
 *         description: Thêm phòng ban thành công
 *       401:
 *         description: Không có quyền truy cập
 */
adminRouter.get(
  "/phong_ban",
  authentication,
  requireRole(3),
  phongban.getPhongBan
);
adminRouter.post(
  "/phong_ban",
  authentication,
  requireRole(1),
  phongban.addPhongBan
);

/**
 * @swagger
 * /api/admin/phong_ban/{id}:
 *   patch:
 *     summary: Cập nhật thông tin phòng ban
 *     tags: [Phòng Ban]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của phòng ban cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_phong_ban:
 *                 type: string
 *                 example: "Phòng Kế toán"
 *               mo_ta:
 *                 type: string
 *                 example: "Phòng kế toán và tài chính"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy phòng ban
 *   delete:
 *     summary: Xóa phòng ban
 *     tags: [Phòng Ban]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của phòng ban cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy phòng ban
 *       400:
 *         description: Không thể xóa vì còn nhân viên trong phòng ban
 */
adminRouter.patch(
  "/phong_ban/:id",
  authentication,
  requireRole(1),
  phongban.updatePhongBan
);
adminRouter.delete(
  "/phong_ban/:id",
  authentication,
  requireRole(1),
  phongban.deletePhongBan
);

// CRUD danh mục tài sản
/**
 * @swagger
 * /api/admin/danh_muc_tai_san:
 *   get:
 *     summary: Lấy danh sách danh mục tài sản (có phân trang)
 *     tags: [Danh Mục Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên danh mục
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DanhMucTaiSan'
 *   post:
 *     summary: Thêm danh mục tài sản mới
 *     tags: [Danh Mục Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_danh_muc
 *             properties:
 *               ten_danh_muc:
 *                 type: string
 *                 example: "Thiết bị IT"
 *               mo_ta:
 *                 type: string
 *                 example: "Các thiết bị công nghệ thông tin"
 *               ma_danh_muc:
 *                 type: string
 *                 example: "IT001"
 *     responses:
 *       201:
 *         description: Thêm danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 */
adminRouter.get(
  "/danh_muc_tai_san",
  authentication,
  requireRole(3),
  DanhMucTaiSan.getAllDanhMucTaiSanController
);
adminRouter.post(
  "/danh_muc_tai_san",
  authentication,
  requireRole(1),
  DanhMucTaiSan.addDanhMucTaiSan
);

/**
 * @swagger
 * /api/admin/danh_muc_tai_san/{id}:
 *   patch:
 *     summary: Cập nhật danh mục tài sản
 *     tags: [Danh Mục Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của danh mục cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_danh_muc:
 *                 type: string
 *               mo_ta:
 *                 type: string
 *               ma_danh_muc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 *   delete:
 *     summary: Xóa danh mục tài sản
 *     tags: [Danh Mục Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 *       400:
 *         description: Không thể xóa vì còn tài sản trong danh mục
 */
adminRouter.patch(
  "/danh_muc_tai_san/:id",
  authentication,
  requireRole(1),
  DanhMucTaiSan.updateDanhMucTaiSan
);
adminRouter.delete(
  "/danh_muc_tai_san/:id",
  authentication,
  requireRole(1),
  DanhMucTaiSan.deleteDanhMucTaiSan
);

/**
 * @swagger
 * /api/admin/danh_muc_tai_san_all:
 *   get:
 *     summary: Lấy tất cả danh mục tài sản (không phân trang)
 *     tags: [Danh Mục Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     description: API này trả về tất cả danh mục mà không có phân trang, thường dùng cho dropdown/select
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DanhMucTaiSan'
 */
adminRouter.get(
  "/danh_muc_tai_san_all",
  authentication,
  requireRole(3),
  DanhMucTaiSan.getDanhMucTaiSan
);
// CRUD tài sản
/**
 * @swagger
 * /api/admin/tai_san:
 *   get:
 *     summary: Lấy danh sách tài sản
 *     tags: [Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: danh_muc_id
 *         schema:
 *           type: integer
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: tinh_trang
 *         schema:
 *           type: string
 *         description: Lọc theo tình trạng
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *
 *   post:
 *     summary: Thêm tài sản mới
 *     tags: [Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_tai_san
 *               - DanhMucTaiSanId
 *               - tong_so_luong
 *               - so_luong_con
 *             properties:
 *               ten_tai_san:
 *                 type: string
 *                 example: "Thiết bị theo dõi hoạt động và phát hiện té ngã"
 *               ten_nha_cung_cap:
 *                 type: string
 *                 example: "PA VietNam"
 *               nha_cung_cap_id:
 *                 type: integer
 *                 example: 2
 *               thong_tin:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   "Màu sắc": "Đỏ"
 *                   "Kích thước": "L"
 *               tong_so_luong:
 *                 type: integer
 *                 example: 1
 *               so_luong_con:
 *                 type: integer
 *                 example: 1
 *               DanhMucTaiSanId:
 *                 type: string
 *                 example: "1"
 *               ngay_dang_ky:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-06"
 *               ngay_het_han:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-15"
 *     responses:
 *       201:
 *         description: Thêm tài sản thành công
 *       401:
 *         description: Không có quyền truy cập
 */

adminRouter.get(
  "/tai_san",
  authentication,
  requireRole(3),
  taiSanController.getTaiSan
);
adminRouter.post(
  "/tai_san",
  authentication,
  requireRole(1),
  taiSanController.addTaiSan
);

/**
 * @swagger
 * /api/admin/tai_san/{id}:
 *   patch:
 *     summary: Cập nhật thông tin tài sản
 *     tags: [Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài sản cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_tai_san:
 *                 type: string
 *               mo_ta:
 *                 type: string
 *               gia_tri:
 *                 type: number
 *               tinh_trang:
 *                 type: string
 *               thong_so_ky_thuat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài sản
 *   delete:
 *     summary: Xóa tài sản
 *     tags: [Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài sản cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tài sản
 */
adminRouter.patch(
  "/tai_san/:id",
  authentication,
  requireRole(1),
  taiSanController.updateTaiSan
);
adminRouter.delete(
  "/tai_san/:id",
  authentication,
  requireRole(1),
  taiSanController.deleteTaiSan
);

/**
 * @swagger
 * /api/admin/tai_san_sap_het_han:
 *   get:
 *     summary: Lấy danh sách tài sản sắp hết hạn
 *     tags: [Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     critical:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                         assets:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TaiSan'
 *                     warning:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                         assets:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TaiSan'
 */
adminRouter.get(
  "/tai_san_sap_het_han",
  authentication,
  requireRole(2),
  taiSanController.getTaiSanSapHetHan
);

/**
 * @swagger
 * /api/admin/tai_san/details:
 *   get:
 *     summary: Lấy chi tiết tài sản
 *     tags: [Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài sản
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TaiSan'
 */
adminRouter.get(
  "/tai_san/details",
  authentication,
  requireRole(3),
  taiSanController.getTaiSanDetailsService
);
//CRUD nhà cung cấp
/**
 * @swagger
 * /api/admin/nha_cung_cap:
 *   get:
 *     summary: Lấy danh sách nhà cung cấp
 *     tags: [Nhà Cung Cấp]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên nhà cung cấp
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NhaCungCap'
 *   post:
 *     summary: Thêm nhà cung cấp mới
 *     tags: [Nhà Cung Cấp]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_nha_cung_cap
 *             properties:
 *               ten_nha_cung_cap:
 *                 type: string
 *                 example: "Công ty TNHH Dell Việt Nam"
 *               dia_chi:
 *                 type: string
 *                 example: "123 Nguyễn Huệ, Q1, TP.HCM"
 *               so_dien_thoai:
 *                 type: string
 *                 example: "0901234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contact@dell.vn"
 *               website:
 *                 type: string
 *                 example: "https://dell.vn"
 *               nguoi_lien_he:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               ghi_chu:
 *                 type: string
 *                 example: "Nhà cung cấp thiết bị IT chính"
 *     responses:
 *       201:
 *         description: Thêm nhà cung cấp thành công
 *       401:
 *         description: Không có quyền truy cập
 */
adminRouter.get(
  "/nha_cung_cap",
  authentication,
  requireRole(3),
  getNhaCungCapController
);

adminRouter.post(
  "/nha_cung_cap",
  authentication,
  requireRole(1),
  addNhaCungCapController
);

/**
 * @swagger
 * /api/admin/nha_cung_cap/{id}:
 *   patch:
 *     summary: Cập nhật thông tin nhà cung cấp
 *     tags: [Nhà Cung Cấp]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhà cung cấp cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_nha_cung_cap:
 *                 type: string
 *               dia_chi:
 *                 type: string
 *               so_dien_thoai:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               website:
 *                 type: string
 *               nguoi_lien_he:
 *                 type: string
 *               ghi_chu:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *   delete:
 *     summary: Xóa nhà cung cấp
 *     tags: [Nhà Cung Cấp]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhà cung cấp cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *       400:
 *         description: Không thể xóa vì còn tài sản từ nhà cung cấp này
 */
adminRouter.patch(
  "/nha_cung_cap/:id",
  authentication,
  requireRole(1),
  updateNhaCungCapController
);
adminRouter.delete(
  "/nha_cung_cap/:id",
  authentication,
  requireRole(1),
  deleteNhaCungCapController
);

// CRUD loại tài sản
/**
 * @swagger
 * /api/admin/loai_tai_san:
 *   get:
 *     summary: Lấy danh sách loại tài sản (có phân trang)
 *     tags: [Loại Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên loại tài sản
 *       - in: query
 *         name: danhMucTaiSanId
 *         schema:
 *           type: integer
 *         description: Lọc theo danh mục tài sản
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       ten:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *                     total_records:
 *                       type: integer
 *   post:
 *     summary: Thêm loại tài sản mới
 *     tags: [Loại Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten
 *               - danhMucTaiSanId
 *             properties:
 *               ten:
 *                 type: string
 *                 example: "Laptop"
 *               danhMucTaiSanId:
 *                 type: integer
 *                 example: 1
 *                 description: "ID của danh mục tài sản"
 *     responses:
 *       201:
 *         description: Thêm loại tài sản thành công
 *       401:
 *         description: Không có quyền truy cập
 */
adminRouter.get(
  "/loai_tai_san",
  authentication,
  requireRole(3),
  getLoaiTaiSanController
);
adminRouter.post(
  "/loai_tai_san",
  authentication,
  requireRole(1),
  addLoaiTaiSanController
);

/**
 * @swagger
 * /api/admin/loai_tai_san/{id}:
 *   patch:
 *     summary: Cập nhật loại tài sản
 *     tags: [Loại Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của loại tài sản cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten:
 *                 type: string
 *                 example: "Desktop"
 *               danhMucTaiSanId:
 *                 type: integer
 *                 example: 1
 *                 description: "ID của danh mục tài sản (tùy chọn)"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại tài sản
 *   delete:
 *     summary: Xóa loại tài sản
 *     tags: [Loại Tài Sản]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của loại tài sản cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại tài sản
 *       400:
 *         description: Không thể xóa vì còn tài sản sử dụng loại này
 */
adminRouter.patch(
  "/loai_tai_san/:id",
  authentication,
  requireRole(1),
  updateLoaiTaiSanController
);
adminRouter.delete(
  "/loai_tai_san/:id",
  authentication,
  requireRole(1),
  deleteLoaiTaiSanController
);

//Thông báo
/**
 * @swagger
 * /api/admin/thong_bao:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     tags: [Thông Báo]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: da_doc
 *         schema:
 *           type: boolean
 *         description: Lọc theo trạng thái đã đọc (true/false)
 *       - in: query
 *         name: loai_thong_bao
 *         schema:
 *           type: string
 *         description: Lọc theo loại thông báo
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       tieu_de:
 *                         type: string
 *                       noi_dung:
 *                         type: string
 *                       loai_thong_bao:
 *                         type: string
 *                         example: "asset_expiring"
 *                       da_doc:
 *                         type: boolean
 *                       nguoi_nhan_id:
 *                         type: integer
 *                       ngay_tao:
 *                         type: string
 *                         format: date-time
 *                       nguoi_gui_id:
 *                         type: integer
 *   post:
 *     summary: Tạo thông báo mới
 *     tags: [Thông Báo]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tieu_de
 *               - noi_dung
 *               - nguoi_nhan_id
 *             properties:
 *               tieu_de:
 *                 type: string
 *                 example: "Thông báo tài sản sắp hết hạn"
 *               noi_dung:
 *                 type: string
 *                 example: "Laptop Dell của bạn sẽ hết hạn vào ngày 15/01/2024"
 *               loai_thong_bao:
 *                 type: string
 *                 example: "asset_expiring"
 *                 description: "Loại thông báo: asset_expiring, request_approved, etc."
 *               nguoi_nhan_id:
 *                 type: integer
 *                 example: 1
 *                 description: "ID người nhận thông báo"
 *               muc_do_uu_tien:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: "high"
 *               lien_ket:
 *                 type: string
 *                 example: "/tai-san/1"
 *                 description: "Link liên kết để chuyển hướng khi click thông báo"
 *     responses:
 *       201:
 *         description: Tạo thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
adminRouter.get("/thong_bao", authentication, requireRole(3), getThongBao);
adminRouter.post("/thong_bao", authentication, requireRole(2), addThongBao);

/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Lấy thông tin tài khoản hiện tại
 *     tags: [Tài Khoản]
 *     security:
 *       - cookieAuth: []
 *     description: API này trả về thông tin chi tiết của user đang đăng nhập
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ten_dang_nhap:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     ho_ten:
 *                       type: string
 *                     vai_tro:
 *                       type: integer
 *                       enum: [1, 2, 3]
 *                       description: "1=Root, 2=Manager, 3=User"
 *                     phong_ban_id:
 *                       type: integer
 *                     ngay_tao:
 *                       type: string
 *                       format: date-time
 *                     lan_dang_nhap_cuoi:
 *                       type: string
 *                       format: date-time
 *                     trang_thai:
 *                       type: string
 *                       enum: [active, inactive, suspended]
 *                     phong_ban:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         ten_phong_ban:
 *                           type: string
 *                         mo_ta:
 *                           type: string
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy thông tin user
 */
adminRouter.get("/me", authentication, requireRole([0, 1, 2, 3]), getMe);
adminRouter.get(
  "/gui-mail-tai-san",
  authentication,
  requireRole(1),
  mailThongBaoTaiSanHetHanController
);
module.exports = adminRouter;
