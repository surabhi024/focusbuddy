import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getCsrfToken } from "../api.js";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const csrfToken = await getCsrfToken();
      await apiFetch("/auth/register", { method: "POST", body: { email, password }, csrfToken });
      nav("/login");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="app theme-dark bg-aurora">
      <div className="card">
        <h1>Create account</h1>
        {err && <p style={{color:"#fb7185"}}>{err}</p>}
        <form onSubmit={submit} className="row">
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password (min 8)" />
          <button className="btn btn-primary">Register</button>
        </form>
        <p className="small">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
