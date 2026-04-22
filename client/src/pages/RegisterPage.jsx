import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "job_seeker"
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await api.auth.register(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container narrow">
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      <form className="stack" onSubmit={handleSubmit}>
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="job_seeker">Job Seeker</option>
          <option value="job_poster">Job Poster</option>
        </select>
        <button className="btn" type="submit">Register</button>
      </form>
    </main>
  );
}
