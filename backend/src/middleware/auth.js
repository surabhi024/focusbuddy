const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};
