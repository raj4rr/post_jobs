import { Link } from "react-router-dom";

export default function JobCard({ job, onApply, onSave, canAct, isActionHidden }) {
  const hideActions = Boolean(isActionHidden);

  return (
    <article className="card">
      <div className="space-between">
        <h3>{job.title}</h3>
        {job.visa_sponsorship_available ? <span className="badge">Sponsorship</span> : <span className="badge off">No Sponsorship</span>}
      </div>
      <p><strong>{job.company_name}</strong> • {job.location_address}</p>
      <p>{job.job_type?.toUpperCase()} • {job.experience_min}-{job.experience_max} years</p>
      <div className="tag-row">
        {(job.skills_required || []).map((skill) => (
          <span key={skill} className="tag">{skill}</span>
        ))}
      </div>
      <div className="actions">
        <Link className="btn" to={`/jobs/${job.id}`}>View Details</Link>
        {canAct && !hideActions && <button className="btn" onClick={() => onApply(job.id)}>Apply Now</button>}
        {canAct && !hideActions && <button className="btn ghost" onClick={() => onSave(job.id)}>Save</button>}
      </div>
    </article>
  );
}
