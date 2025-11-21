const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./router/auth");
const adminRouter = require("./router/admin");
const ssoRoutes = require("./router/sso");
const { connectToDB } = require("./config/database.js");
const cron = require("node-cron");
const axios = require("axios");
const swaggerDocs = require("./config/swagger");
const app = express();
const workosConfig = require("./config/ssoConfig");
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
swaggerDocs(app);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRoutes);
app.use("/api/sso", ssoRoutes);
// Cron jobs
const setupCronJobs = () => {
  cron.schedule("0 8 * * *", async () => {
    try {
      const res2 = await axios.get(
        "https://taisanso.tmedu.vn/api/admin/gui-mail-tai-san-het-han"
      );
    } catch (err) {
      console.error("❌ Lỗi gửi mail tài sản hết hạn:", err.message);
    }
  });

  cron.schedule("30 8 * * *", async () => {
    try {
      const res = await axios.get("/api/admin/gui-mail");
      console.log("✅ Gửi mail thông báo cá nhân thành công:", res.data);
    } catch (err) {
      console.error("❌ Lỗi gửi mail thông báo cá nhân:", err.message);
    }
  });

  cron.schedule("55 9 * * *", async () => {
    try {
      const urgentCheck = await axios.get(
        "https://taisanso.tmedu.vn/api/admin/tai_san_sap_het_han"
      );
      const urgentAssets =
        urgentCheck.data.critical?.assets?.filter(
          (asset) => asset.so_ngay_con_lai <= 1
        ) || [];
      if (urgentAssets.length > 0) {
        const res = await axios.get(
          "https://taisanso.tmedu.vn/api/admin/gui-mail-tai-san-het-han"
        );
        console.log(
          `🚨 Gửi mail khẩn cấp cho ${urgentAssets.length} tài sản:`,
          res.data
        );
      } else {
        console.log("✅ Không có tài sản nào cần thông báo khẩn cấp");
      }
    } catch (err) {
      console.error("❌ Lỗi khi kiểm tra mail khẩn cấp:", err.message);
    }
  });
};

// Handle uncaught errors để Node không crash
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// Start server
const startServer = async () => {
  try {
    await connectToDB();
    console.log("✅ Database connected");

    setupCronJobs();

    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
