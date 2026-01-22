const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

function cookieOptions() {
  const secure = String(process.env.COOKIE_SECURE).toLowerCase() === "true";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: 2 * 60 * 60 * 1000
  };
}

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const [existing] = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (existing.length) return res.status(409).json({ error: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await db.query("INSERT INTO users (email, password_hash) VALUES (?,?)", [email, password_hash]);

    const userId = result.insertId;
    await db.query("INSERT INTO preferences (user_id) VALUES (?)", [userId]);
    await db.query("INSERT INTO streaks (user_id) VALUES (?)", [userId]);

    return res.json({ message: "Registered" });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const [rows] = await db.query("SELECT id,email,password_hash FROM users WHERE email=?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.cookie("access_token", token, cookieOptions());

    return res.json({ message: "Logged in" });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out" });
});


module.exports = router;
