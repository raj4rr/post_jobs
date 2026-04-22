import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.jobs.byId(id);
        setJob(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  async function apply() {
    try {
      const result = await api.jobs.apply(id, {});
      alert(`Application submitted. Match: ${result.matchPercent}%`);
    } catch (err) {
      alert(err.message);
    }
  }

  async function save() {
    try {
      await api.jobs.save(id);
      alert("Job saved");
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) return <main className="container"><p className="error">{error}</p></main>;
  if (!job) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <h2>{job.title}</h2>
      <p><strong>{job.company_name}</strong> • {job.location_address}</p>
      <p>{job.job_type?.toUpperCase()} • Experience {job.experience_min}-{job.experience_max} years</p>
      <p><strong>Sponsorship:</strong> {job.visa_sponsorship_available ? "Available" : "Not Available"}</p>
      <p><strong>Referrer:</strong> {job.referrer_name || "N/A"} ({job.referrer_email || "N/A"})</p>
      <p><strong>Openings:</strong> {job.openings || 1}</p>
      <p><strong>Deadline:</strong> {job.application_deadline || "N/A"}</p>
      <h4>Description</h4>
      <p>{job.description}</p>
      <div className="tag-row">
        {(job.skills_required || []).map((skill) => (
          <span key={skill} className="tag">{skill}</span>
        ))}
      </div>
      {user?.role === "job_seeker" && (
        <div className="actions">
          <button className="btn" onClick={apply}>Apply</button>
          <button className="btn ghost" onClick={save}>Save Job</button>
        </div>
      )}
    </main>
  );
}
