import React, { useEffect, useMemo, useState } from "react";
import { apiFetch, getCsrfToken } from "../api.js";
import PreferencesPanel from "../components/PreferencesPanel.jsx";
import FocusTimer from "../components/FocusTimer.jsx";
import QuoteBox from "../components/QuoteBox.jsx";
import MusicPlayer from "../components/MusicPlayer.jsx";
import StreakBadge from "../components/StreakBadge.jsx";

export default function Dashboard() {
  const [prefs, setPrefs] = useState({ theme: "dark", layout: "timer_center", background: "aurora", music_enabled: false });
  const [streak, setStreak] = useState({ current_streak: 0, best_streak: 0 });
  const [quoteMode, setQuoteMode] = useState("focus");

  const appClass = useMemo(() => `app theme-${prefs.theme} bg-${prefs.background}`, [prefs]);
  const layoutClass = prefs.layout === "split" ? "split" : "";

  async function loadAll() {
    const p = await apiFetch("/preferences");
    setPrefs(prev => ({ ...prev, ...p }));

    const s = await apiFetch("/sessions/streak");
    setStreak(s);
  }

  useEffect(() => { loadAll(); }, []);

  async function savePrefs() {
    const csrfToken = await getCsrfToken();
    await apiFetch("/preferences", { method: "PUT", body: prefs, csrfToken });
  }

  async function logout() {
    const csrfToken = await getCsrfToken();
    await apiFetch("/auth/logout", { method: "POST", csrfToken });
    localStorage.removeItem("fb_logged_in");
    window.location.href = "/login";
  }

  return (
    <div className={appClass}>
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 style={{ margin: 0 }}>FocusBuddy</h1>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>

        <div className={layoutClass} style={{ marginTop: 12 }}>
          <div>
            <div className="row">
              <StreakBadge streak={streak} />
              <QuoteBox mode={quoteMode} />
              <MusicPlayer enabled={!!prefs.music_enabled} />
            </div>

            <div style={{ marginTop: 12 }}>
              <PreferencesPanel prefs={prefs} setPrefs={setPrefs} onSave={savePrefs} />
            </div>
          </div>

          <div>
            <FocusTimer
              onModeChange={setQuoteMode}
              onSessionSaved={async () => { await loadAll(); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
