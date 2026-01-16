const jwt = require("jsonwebtoken");

const secret = "test";

const getToken = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim();
};

const authenticate = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      id: decoded?.id,
      role: decoded?.role || "doctor",
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireRole = (roles = []) => (req, res, next) => {
  const role = req.user?.role;
  if (!role) {
    return res.status(401).json({ message: "Missing auth context" });
  }
  if (!roles.includes(role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

module.exports = { authenticate, requireRole };
