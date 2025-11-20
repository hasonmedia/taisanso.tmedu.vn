const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT);
      // Xử lý cả token thường và token SSO
      req.user = decoded.user || decoded; // Nếu có decoded.user thì dùng, không thì dùng decoded
      console.log("Decoded user from token:", req.user);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const userRole = req.user.cap;
    console.log("User role:", userRole, "Allowed role:", allowedRoles);

    if (userRole === 0) {
      return next();
    }

    if (Array.isArray(allowedRoles)) {
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Không có quyền" });
      }
    } else {
      if (userRole > allowedRoles) {
        return res.status(403).json({ message: "Không có quyền" });
      }
    }

    next();
  };
};

module.exports = { authentication, requireRole };
