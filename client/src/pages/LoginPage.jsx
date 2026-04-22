import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await api.auth.login(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container narrow">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form className="stack" onSubmit={handleSubmit}>
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn" type="submit">Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </main>
  );
}
