const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hệ thống Quản lý Tài sản - API Documentation",
      version: "1.0.0",
      description: "API Documentation cho hệ thống quản lý tài sản số",
      contact: {
        name: "Development Team",
        email: "dev@taisanso.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
        // url: "http://taisanso_backend:3001/",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            ten_dang_nhap: { type: "string" },
            email: { type: "string", format: "email" },
            ho_ten: { type: "string" },
            vai_tro: {
              type: "integer",
              enum: [1, 2, 3],
              description: "1=Root, 2=Manager, 3=User",
            },
            phong_ban_id: { type: "integer" },
            ngay_tao: { type: "string", format: "date-time" },
            lan_dang_nhap_cuoi: { type: "string", format: "date-time" },
            trang_thai: {
              type: "string",
              enum: ["active", "inactive", "suspended"],
            },
          },
        },
        TaiSan: {
          type: "object",
          properties: {
            id: { type: "integer" },
            ten_tai_san: { type: "string" },
            mo_ta: { type: "string" },
            gia_tri: { type: "number" },
            ngay_mua: { type: "string", format: "date" },
            tinh_trang: { type: "string" },
            danh_muc_id: { type: "integer" },
            nha_cung_cap_id: { type: "integer" },
            thong_so_ky_thuat: { type: "string" },
            so_serial: { type: "string" },
            ma_tai_san: { type: "string" },
            ngay_bao_hanh: { type: "string", format: "date" },
            vi_tri: { type: "string" },
            nguoi_su_dung_id: { type: "integer" },
          },
        },
        YeuCau: {
          type: "object",
          properties: {
            id: { type: "integer" },
            loai_yeu_cau: {
              type: "string",
              enum: ["muon_tai_san", "tra_tai_san", "bao_hong", "bao_mat"],
            },
            mo_ta: { type: "string" },
            trang_thai: {
              type: "string",
              enum: ["pending", "approved", "rejected", "completed"],
            },
            tai_san_id: { type: "integer" },
            nguoi_yeu_cau_id: { type: "integer" },
            ngay_tao: { type: "string", format: "date-time" },
            ngay_bat_dau: { type: "string", format: "date" },
            ngay_ket_thuc: { type: "string", format: "date" },
            ly_do_tu_choi: { type: "string" },
            ghi_chu_phe_duyet: { type: "string" },
            nguoi_phe_duyet_id: { type: "integer" },
            ngay_phe_duyet: { type: "string", format: "date-time" },
          },
        },
        PhongBan: {
          type: "object",
          properties: {
            id: { type: "integer" },
            ten_phong_ban: { type: "string" },
            mo_ta: { type: "string" },
            ma_phong_ban: { type: "string" },
            truong_phong_id: { type: "integer" },
            ngay_thanh_lap: { type: "string", format: "date" },
          },
        },
        DanhMucTaiSan: {
          type: "object",
          properties: {
            id: { type: "integer" },
            ten_danh_muc: { type: "string" },
            mo_ta: { type: "string" },
            ma_danh_muc: { type: "string" },
            danh_muc_cha_id: { type: "integer" },
            thu_tu_sap_xep: { type: "integer" },
          },
        },
        NhaCungCap: {
          type: "object",
          properties: {
            id: { type: "integer" },
            ten_nha_cung_cap: { type: "string" },
            dia_chi: { type: "string" },
            so_dien_thoai: { type: "string" },
            email: { type: "string", format: "email" },
            website: { type: "string" },
            nguoi_lien_he: { type: "string" },
            ghi_chu: { type: "string" },
            ma_so_thue: { type: "string" },
          },
        },
        ThongTinDangNhapTaiSan: {
          type: "object",
          properties: {
            id: { type: "integer" },
            tai_san_id: { type: "integer" },
            ten_dang_nhap: { type: "string" },
            mat_khau: { type: "string" },
            mo_ta: { type: "string" },
            url_truy_cap: { type: "string" },
            ngay_het_han: { type: "string", format: "date" },
            loai_tai_khoan: { type: "string" },
            quyen_han: { type: "string" },
          },
        },
        ThongBao: {
          type: "object",
          properties: {
            id: { type: "integer" },
            tieu_de: { type: "string" },
            noi_dung: { type: "string" },
            loai_thong_bao: { type: "string" },
            da_doc: { type: "boolean" },
            nguoi_nhan_id: { type: "integer" },
            nguoi_gui_id: { type: "integer" },
            ngay_tao: { type: "string", format: "date-time" },
            muc_do_uu_tien: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
            },
            lien_ket: { type: "string" },
          },
        },
        HanhDong: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nguoi_dung_id: { type: "integer" },
            loai_hanh_dong: { type: "string" },
            mo_ta: { type: "string" },
            thoi_gian: { type: "string", format: "date-time" },
            ip_address: { type: "string" },
            user_agent: { type: "string" },
            du_lieu_cu: { type: "object" },
            du_lieu_moi: { type: "object" },
            bang_du_lieu: { type: "string" },
            id_ban_ghi: { type: "integer" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            error: { type: "string" },
          },
        },
        PaginationResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array", items: { type: "object" } },
            pagination: {
              type: "object",
              properties: {
                current_page: { type: "integer" },
                total_pages: { type: "integer" },
                total_records: { type: "integer" },
                per_page: { type: "integer" },
              },
            },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  // Quét tất cả file routes để lấy API tự động
  apis: ["./router/*.js", "./controller/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
  // Swagger UI options
  const options = {
    explorer: true,
    swaggerOptions: {
      validatorUrl: null,
      tryItOutEnabled: true,
      requestInterceptor: (req) => {
        // Thêm credentials cho tất cả requests
        req.credentials = "include";
        return req;
      },
    },
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

  // Endpoint để lấy raw swagger spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

module.exports = swaggerDocs;
