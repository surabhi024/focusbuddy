import React from "react";
export default function StreakBadge({ streak }) {
  return (
    <div className="badge">
      🔥 Streak: <b>{streak.current_streak || 0}</b> | Best: <b>{streak.best_streak || 0}</b>
    </div>
  );
}
