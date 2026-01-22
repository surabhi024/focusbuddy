const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

function ymd(dateObj) {
  return dateObj.toISOString().slice(0, 10);
}

router.post("/complete", auth, async (req, res) => {
  const { session_type, duration_sec, started_at, ended_at } = req.body || {};
  if (!session_type || !duration_sec || !started_at || !ended_at) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await db.query(
    "INSERT INTO sessions (user_id, session_type, duration_sec, started_at, ended_at) VALUES (?,?,?,?,?)",
    [req.user.id, session_type, duration_sec, new Date(started_at), new Date(ended_at)]
  );

  if (session_type === "focus") {
    const today = ymd(new Date());

    const [rows] = await db.query(
      "SELECT current_streak, best_streak, last_active_date FROM streaks WHERE user_id=?",
      [req.user.id]
    );

    const st = rows[0] || { current_streak: 0, best_streak: 0, last_active_date: null };
    let newStreak = st.current_streak || 0;

    const last = st.last_active_date ? ymd(new Date(st.last_active_date)) : null;

    if (!last) {
      newStreak = 1;
    } else {
      const lastDate = new Date(last);
      const todayDate = new Date(today);
      const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diff === 0) newStreak = st.current_streak;
      else if (diff === 1) newStreak = st.current_streak + 1;
      else newStreak = 1;
    }

    const best = Math.max(st.best_streak || 0, newStreak);

    await db.query(
      "UPDATE streaks SET current_streak=?, best_streak=?, last_active_date=? WHERE user_id=?",
      [newStreak, best, today, req.user.id]
    );
  }

  res.json({ message: "Session stored" });
});

router.get("/streak", auth, async (req, res) => {
  const [rows] = await db.query(
    "SELECT current_streak, best_streak, last_active_date FROM streaks WHERE user_id=?",
    [req.user.id]
  );
  res.json(rows[0] || { current_streak: 0, best_streak: 0, last_active_date: null });
});


module.exports = router;
