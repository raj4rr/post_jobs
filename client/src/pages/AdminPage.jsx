import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [error, setError] = useState("");

  async function loadAll() {
    try {
      setError("");
      const [a, u, jobs] = await Promise.all([
        api.admin.analytics(),
        api.admin.users(),
        api.jobs.list("sort=latest")
      ]);
      setAnalytics(a);
      setUsers(u);
      setPendingJobs(jobs.filter((job) => job.status === "pending"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function moderate(id, status) {
    try {
      await api.admin.moderateJob(id, status);
      await loadAll();
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) return <main className="container"><p className="error">{error}</p></main>;

  return (
    <main className="container">
      <h2>Admin Panel</h2>
      {analytics && (
        <section className="grid">
          <article className="card"><h4>Users</h4><p>{analytics.users.count}</p></article>
          <article className="card"><h4>Jobs</h4><p>{analytics.jobs.count}</p></article>
          <article className="card"><h4>Applications</h4><p>{analytics.applications.count}</p></article>
          <article className="card"><h4>Pending Jobs</h4><p>{analytics.pendingJobs.count}</p></article>
        </section>
      )}

      <h3>Pending Job Approvals</h3>
      {pendingJobs.length === 0 && <p>No pending jobs.</p>}
      {pendingJobs.map((job) => (
        <article className="card" key={job.id}>
          <p><strong>{job.title}</strong> at {job.company_name}</p>
          <div className="actions">
            <button className="btn" onClick={() => moderate(job.id, "approved")}>Approve</button>
            <button className="btn ghost" onClick={() => moderate(job.id, "rejected")}>Reject</button>
          </div>
        </article>
      ))}

      <h3>Users</h3>
      {users.map((u) => (
        <article className="card" key={u.id}>
          <p>{u.name} • {u.email} • {u.role}</p>
        </article>
      ))}
    </main>
  );
}
