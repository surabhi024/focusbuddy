const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const [rows] = await db.query(
    "SELECT theme, layout_mode, background, music_enabled FROM preferences WHERE user_id=?",
    [req.user.id]
  );

  res.json(rows[0] || { theme: "dark", layout_mode: "timer_center", background: "aurora", music_enabled: 0 });
});

router.put("/", auth, async (req, res) => {
  const { theme, layout_mode, background, music_enabled } = req.body || {};

  await db.query(
    "UPDATE preferences SET theme=?, layout_mode=?, background=?, music_enabled=? WHERE user_id=?",
    [theme, layout_mode, background, !!music_enabled, req.user.id]
  );

  res.json({ message: "Preferences saved" });
});

module.exports = router;
