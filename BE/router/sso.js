const express = require("express");
const router = express.Router();
const ssoController = require("../controller/sso");

// Endpoint 1: Khởi tạo SSO (POST /api/sso/initiate)
router.post("/initiate", ssoController.initiateLogin);

// Endpoint 2: Xử lý Callback (GET /api/sso/callback)
router.get("/callback", ssoController.handleCallback);

module.exports = router;
