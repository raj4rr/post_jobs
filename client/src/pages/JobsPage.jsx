import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import JobCard from "../components/JobCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function JobsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [hiddenActionsByJob, setHiddenActionsByJob] = useState({});
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    skills: "",
    experienceRange: "",
    jobType: "",
    location: "",
    sponsorship: "",
    companyName: "",
    sort: "latest"
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  async function loadJobs() {
    try {
      setError("");
      const data = await api.jobs.list(queryString);
      setJobs(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [queryString]);

  useEffect(() => {
    (async () => {
      if (user?.role !== "job_seeker") {
        setHiddenActionsByJob({});
        return;
      }

      try {
        const dashboard = await api.profile.seekerDashboard();
        const hidden = {};
        dashboard.applied.forEach((item) => {
          hidden[String(item.job_id)] = true;
        });
        dashboard.saved.forEach((item) => {
          hidden[String(item.job_id)] = true;
        });
        setHiddenActionsByJob(hidden);
      } catch {
        // noop: main job listing should still work
      }
    })();
  }, [user?.role]);

  async function onApply(jobId) {
    try {
      await api.jobs.apply(jobId, {});
      setHiddenActionsByJob((prev) => ({ ...prev, [String(jobId)]: true }));
      alert("Applied successfully");
    } catch (err) {
      if (err.message.includes("Unauthorized")) {
        navigate("/login");
      } else {
        alert(err.message);
      }
    }
  }

  async function onSave(jobId) {
    try {
      await api.jobs.save(jobId);
      setHiddenActionsByJob((prev) => ({ ...prev, [String(jobId)]: true }));
      alert("Job saved");
    } catch (err) {
      if (err.message.includes("Unauthorized")) {
        navigate("/login");
      } else {
        alert(err.message);
      }
    }
  }

  return (
    <main className="container">
      <h2>Find Referral Jobs</h2>
      <section className="grid filters">
        <input placeholder="Search title, company, skill" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input placeholder="Skills (React, Python)" value={filters.skills} onChange={(e) => setFilters({ ...filters, skills: e.target.value })} />
        <input placeholder="Experience range (0-2)" value={filters.experienceRange} onChange={(e) => setFilters({ ...filters, experienceRange: e.target.value })} />
        <select value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
          <option value="">All Types</option>
          <option value="remote">Remote</option>
          <option value="office">Office</option>
          <option value="wfh">WFH</option>
        </select>
        <input placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <input placeholder="Company" value={filters.companyName} onChange={(e) => setFilters({ ...filters, companyName: e.target.value })} />
        <select value={filters.sponsorship} onChange={(e) => setFilters({ ...filters, sponsorship: e.target.value })}>
          <option value="">Sponsorship: All</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="latest">Latest</option>
          <option value="relevant">Most Relevant</option>
        </select>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={onApply}
            onSave={onSave}
            canAct={user?.role === "job_seeker"}
            isActionHidden={Boolean(hiddenActionsByJob[String(job.id)])}
          />
        ))}
      </section>
    </main>
  );
}
