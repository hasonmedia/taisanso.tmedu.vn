const express = require("express");
const { authentication } = require("../middleware/auth.js");
const {
  register,
  login,
  logout,
  update,
  deleteAccount,
} = require("../controller/auth.js");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API xác thực người dùng
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_dang_nhap
 *               - email
 *               - mat_khau
 *               - ho_ten
 *             properties:
 *               ten_dang_nhap:
 *                 type: string
 *                 example: "admin"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               mat_khau:
 *                 type: string
 *                 example: "123456"
 *               ho_ten:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               vai_tro:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 example: 3
 *               phong_ban_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Tài khoản đã tồn tại
 */
router.post("/register", authentication, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_dang_nhap
 *               - mat_khau
 *             properties:
 *               ten_dang_nhap:
 *                 type: string
 *                 example: "admin"
 *               mat_khau:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Sai thông tin đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất khỏi hệ thống
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Chưa đăng nhập
 */
router.post("/logout", authentication, logout);

/**
 * @swagger
 * /api/auth/update/{id}:
 *   patch:
 *     summary: Cập nhật thông tin tài khoản
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài khoản cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ho_ten:
 *                 type: string
 *                 example: "Nguyễn Văn B"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               mat_khau:
 *                 type: string
 *                 example: "newpassword"
 *               phong_ban_id:
 *                 type: integer
 *                 example: 2
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
 *         description: Không tìm thấy tài khoản
 */
router.patch("/update/:id", authentication, update);
router.delete("/delete/:id", authentication, deleteAccount);
module.exports = router;
