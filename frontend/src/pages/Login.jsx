import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getCsrfToken } from "../api.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const csrfToken = await getCsrfToken();
      await apiFetch("/auth/login", { method: "POST", body: { email, password }, csrfToken });
      localStorage.setItem("fb_logged_in", "1");
      nav("/");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="app theme-dark bg-aurora">
      <div className="card">
        <h1>FocusBuddy</h1>
        <p className="small">Log in to start focusing.</p>
        {err && <p style={{color:"#fb7185"}}>{err}</p>}
        <form onSubmit={submit} className="row">
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" />
          <button className="btn btn-primary">Login</button>
        </form>
        <p className="small">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
