import React, { useEffect, useRef, useState } from "react";
import { apiFetch, getCsrfToken } from "../api.js";

const DUR = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60
};

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function FocusTimer({ onModeChange, onSessionSaved }) {
  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(DUR.focus);
  const [focusCount, setFocusCount] = useState(0);

  const startMsRef = useRef(null);
  const startedAtRef = useRef(null);

  useEffect(() => {
    onModeChange?.(mode);
    setRemaining(DUR[mode]);
    startedAtRef.current = null;
    setRunning(false);
  }, [mode]);

  // tab switch warning
  useEffect(() => {
    const handler = () => {
      if (document.hidden && running && mode === "focus") alert("FocusBuddy: stay on this tab to keep your focus.");
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [running, mode]);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startMsRef.current) / 1000);
      const left = Math.max(DUR[mode] - elapsed, 0);
      setRemaining(left);

      if (left === 0) {
        setRunning(false);
        completeSession();
      }
    };

    const id = setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
  }, [running, mode]);

  function start() {
    if (running) return;
    setRunning(true);
    if (!startedAtRef.current) startedAtRef.current = new Date().toISOString();

    const alreadyElapsed = DUR[mode] - remaining;
    startMsRef.current = Date.now() - alreadyElapsed * 1000;
  }

  function pause() { setRunning(false); }

  function reset() {
    setRunning(false);
    setRemaining(DUR[mode]);
    startedAtRef.current = null;
  }

  async function completeSession() {
    const started_at = startedAtRef.current || new Date().toISOString();
    const ended_at = new Date().toISOString();

    const csrfToken = await getCsrfToken();
    await apiFetch("/sessions/complete", {
      method: "POST",
      csrfToken,
      body: {
        session_type: mode,
        duration_sec: DUR[mode],
        started_at,
        ended_at
      }
    });

    onSessionSaved?.();

    if (mode === "focus") {
      const next = focusCount + 1;
      setFocusCount(next);
      setMode(next % 4 === 0 ? "long_break" : "short_break");
    } else {
      setMode("focus");
    }
  }

  return (
    <div>
      <div className="row">
        <div className="badge">Mode: <b>{mode.replace("_", " ")}</b></div>
        <div className="badge">Focus sessions: <b>{focusCount}</b></div>
      </div>

      <div className="big" style={{ marginTop: 10 }}>{fmt(remaining)}</div>

      <div className="row" style={{ marginTop: 10 }}>
        {!running ? (
          <button className="btn btn-primary" onClick={start}>Start</button>
        ) : (
          <button className="btn btn-ghost" onClick={pause}>Pause</button>
        )}
        <button className="btn btn-ghost" onClick={reset}>Reset</button>

        <button className="btn btn-ghost" onClick={()=>setMode("focus")}>Focus</button>
        <button className="btn btn-ghost" onClick={()=>setMode("short_break")}>Short Break</button>
        <button className="btn btn-ghost" onClick={()=>setMode("long_break")}>Long Break</button>
      </div>
    </div>
  );
}
