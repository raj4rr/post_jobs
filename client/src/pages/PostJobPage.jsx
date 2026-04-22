import { useState } from "react";
import { api } from "../api.js";

export default function PostJobPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    company_name: "",
    description: "",
    skills_required: "",
    experience_min: 0,
    experience_max: 0,
    job_type: "remote",
    location_address: "",
    salary: "",
    referrer_name: "",
    referrer_email: "",
    referral_id: "",
    visa_sponsorship_available: false,
    application_deadline: "",
    openings: 1
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const payload = {
        ...form,
        skills_required: form.skills_required.split(",").map((s) => s.trim()).filter(Boolean)
      };
      const data = await api.jobs.create(payload);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <h2>Post a Job</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form className="grid" onSubmit={handleSubmit}>
        <input placeholder="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Company Name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        <textarea placeholder="Job Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Skills (comma separated)" value={form.skills_required} onChange={(e) => setForm({ ...form, skills_required: e.target.value })} />
        <input type="number" placeholder="Experience Min" value={form.experience_min} onChange={(e) => setForm({ ...form, experience_min: Number(e.target.value) })} />
        <input type="number" placeholder="Experience Max" value={form.experience_max} onChange={(e) => setForm({ ...form, experience_max: Number(e.target.value) })} />
        <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
          <option value="remote">Remote</option>
          <option value="office">Office</option>
          <option value="wfh">WFH</option>
        </select>
        <input placeholder="Location Address" value={form.location_address} onChange={(e) => setForm({ ...form, location_address: e.target.value })} />
        <input placeholder="Salary (optional)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        <input placeholder="Referrer Name" value={form.referrer_name} onChange={(e) => setForm({ ...form, referrer_name: e.target.value })} />
        <input placeholder="Referrer Email" value={form.referrer_email} onChange={(e) => setForm({ ...form, referrer_email: e.target.value })} />
        <input placeholder="Referral ID (optional)" value={form.referral_id} onChange={(e) => setForm({ ...form, referral_id: e.target.value })} />
        <label className="inline">
          <input
            type="checkbox"
            checked={form.visa_sponsorship_available}
            onChange={(e) => setForm({ ...form, visa_sponsorship_available: e.target.checked })}
          />
          Visa Sponsorship Available
        </label>
        <input type="date" value={form.application_deadline} onChange={(e) => setForm({ ...form, application_deadline: e.target.value })} />
        <input type="number" placeholder="Openings" value={form.openings} onChange={(e) => setForm({ ...form, openings: Number(e.target.value) })} />
        <button className="btn" type="submit">Submit Job</button>
      </form>
    </main>
  );
}
