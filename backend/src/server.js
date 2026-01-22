require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const csurf = require("csurf");

const authRoutes = require("./routes/auth.routes.js");
const prefRoutes = require("./routes/preferences.routes.js");
const sessionsRoutes = require("./routes/sessions.routes.js");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

// Rate limit only auth endpoints
app.use("/api/auth", rateLimit({ windowMs: 60 * 1000, max: 25 }));

// CSRF (cookie-based)
const csrfProtection = csurf({ cookie: true });

// Route to get CSRF token
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF only to unsafe methods
app.use((req, res, next) => {
  const unsafe = ["POST", "PUT", "PATCH", "DELETE"];
  if (unsafe.includes(req.method)) return csrfProtection(req, res, next);
  return next();
});

// ✅ ROUTES (these must be routers, not objects)
app.use("/api/auth", authRoutes);
app.use("/api/preferences", prefRoutes);
app.use("/api/sessions", sessionsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// CSRF error handler
app.use((err, req, res, next) => {
  if (err && err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  return res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
