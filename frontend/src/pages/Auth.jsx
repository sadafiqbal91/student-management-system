import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth({ mode }) {
  const reg = mode === "register";
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (reg && !f.name.trim()) return setErr("Name is required");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters");
    setLoading(true);
    try {
      if (reg) {
        await api.post("/auth/register", f);
        nav("/login");
      } else {
        const { data } = await api.post("/auth/login", { email: f.email, password: f.password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        nav("/");
      }
    } catch (e) {
      setErr(e.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth">
      <h2>{reg ? "Register" : "Login"}</h2>
      <form className="form" onSubmit={submit}>
        {reg && <input name="name" placeholder="Name" value={f.name} onChange={change} />}
        <input name="email" placeholder="Email" value={f.email} onChange={change} />
        <input name="password" type="password" placeholder="Password" value={f.password} onChange={change} />
        {err && <div className="err">{err}</div>}
        <button disabled={loading}>
          {loading && <span className="spinner" />}
          {reg ? "Register" : "Login"}
        </button>
      </form>
      <p>
        {reg ? <Link to="/login">Already have an account? Login</Link> : <Link to="/register">New user? Register</Link>}
      </p>
    </div>
  );
}