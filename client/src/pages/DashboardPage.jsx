import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const payload = user?.role === "job_seeker"
          ? await api.profile.seekerDashboard()
          : await api.profile.posterDashboard();
        setData(payload);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [user?.role]);

  if (error) return <main className="container"><p className="error">{error}</p></main>;
  if (!data) return <main className="container"><p>Loading dashboard...</p></main>;

  if (user?.role === "job_seeker") {
    return (
      <main className="container">
        <h2>Job Seeker Dashboard</h2>
        <p><strong>Profile Completion:</strong> {data.profileCompletion}%</p>

        <h3>Applied Jobs</h3>
        {data.applied.length === 0 && <p>No applications yet.</p>}
        {data.applied.map((item) => (
          <article className="card" key={item.id}>
            <p><strong>{item.title}</strong> at {item.company_name}</p>
            <p>Status: {item.status}</p>
          </article>
        ))}

        <h3>Saved Jobs</h3>
        {data.saved.length === 0 && <p>No saved jobs yet.</p>}
        {data.saved.map((item) => (
          <article className="card" key={item.id}>
            <p><strong>{item.title}</strong> at {item.company_name}</p>
            <Link className="btn" to={`/jobs/${item.job_id}`}>View Job</Link>
          </article>
        ))}
      </main>
    );
  }

  return (
    <main className="container">
      <h2>Job Poster Dashboard</h2>

      <h3>Posted Jobs</h3>
      {data.postedJobs.length === 0 && <p>No jobs posted yet.</p>}
      {data.postedJobs.map((job) => (
        <article className="card" key={job.id}>
          <p><strong>{job.title}</strong> at {job.company_name}</p>
          <p>Status: {job.status} • Applicants: {job.applicant_count}</p>
        </article>
      ))}

      <h3>Applicants</h3>
      {data.applicants.length === 0 && <p>No applicants yet.</p>}
      {data.applicants.map((app) => (
        <article className="card" key={app.id}>
          <p><strong>{app.name}</strong> applied for {app.job_title}</p>
          <p>{app.email} • Status: {app.status}</p>
          {app.resume_url && <a className="btn" href={app.resume_url} target="_blank" rel="noreferrer">Download Resume</a>}
        </article>
      ))}
    </main>
  );
}
