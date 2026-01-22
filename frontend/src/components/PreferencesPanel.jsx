import React from "react";

export default function PreferencesPanel({ prefs, setPrefs, onSave }) {
  return (
    <div className="row">
      <label className="badge">
        Theme:
        <select className="input" value={prefs.theme} onChange={e=>setPrefs(p=>({...p, theme:e.target.value}))}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="focus">Focus Green</option>
        </select>
      </label>

      <label className="badge">
        Background:
        <select className="input" value={prefs.background} onChange={e=>setPrefs(p=>({...p, background:e.target.value}))}>
          <option value="aurora">Aurora</option>
          <option value="cafe">Cafe</option>
          <option value="forest">Forest</option>
        </select>
      </label>

      <label className="badge">
        Layout:
        <select className="input" value={prefs.layout} onChange={e=>setPrefs(p=>({...p, layout:e.target.value}))}>
          <option value="timer_center">Timer Center</option>
          <option value="split">Split</option>
        </select>
      </label>

      <label className="badge">
        <input
          type="checkbox"
          checked={!!prefs.music_enabled}
          onChange={e=>setPrefs(p=>({...p, music_enabled:e.target.checked}))}
        />
        Music enabled
      </label>

      <button className="btn btn-ghost" onClick={onSave}>Save</button>
    </div>
  );
}
