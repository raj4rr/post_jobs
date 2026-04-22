import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function ProfilePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    phone: "",
    location: "",
    experience_years: 0,
    skills: "",
    resume_url: "",
    education: "",
    work_experience: "",
    portfolio_url: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const profile = await api.profile.getMe();
        setForm({
          phone: profile.phone || "",
          location: profile.location || "",
          experience_years: profile.experience_years || 0,
          skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
          resume_url: profile.resume_url || "",
          education: profile.education || "",
          work_experience: profile.work_experience || "",
          portfolio_url: profile.portfolio_url || ""
        });
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  async function save(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.profile.saveMe({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean)
      });
      setMessage("Profile updated");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <h2>Your Profile</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form className="grid" onSubmit={save}>
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input type="number" placeholder="Experience (years)" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })} />
        <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <input placeholder="Resume URL (or uploaded file link)" value={form.resume_url} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} />
        <textarea placeholder="Education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
        <textarea placeholder="Work Experience" value={form.work_experience} onChange={(e) => setForm({ ...form, work_experience: e.target.value })} />
        <input placeholder="Portfolio / GitHub" value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} />
        <button className="btn" type="submit">Save Profile</button>
      </form>
    </main>
  );
}
