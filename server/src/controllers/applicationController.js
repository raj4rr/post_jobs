import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function parseSkills(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "string") {
        return parsed.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      return raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export const applyToJob = asyncHandler(async (req, res) => {
  const { resume_url = null, note = "" } = req.body;
  const jobId = Number(req.params.id);

  const jobs = await query("SELECT id, status, skills_required FROM jobs WHERE id = ?", [jobId]);
  if (jobs.length === 0) {
    return res.status(404).json({ message: "Job not found" });
  }
  if (jobs[0].status !== "approved") {
    return res.status(400).json({ message: "Cannot apply to unapproved job" });
  }

  const existing = await query(
    "SELECT id FROM applications WHERE user_id = ? AND job_id = ?",
    [req.user.id, jobId]
  );

  if (existing.length > 0) {
    return res.status(409).json({ message: "Already applied" });
  }

  const profileRows = await query("SELECT skills, resume_url FROM profiles WHERE user_id = ?", [req.user.id]);
  const profileSkills = parseSkills(profileRows[0]?.skills);
  const jobSkills = parseSkills(jobs[0].skills_required);

  const overlap = jobSkills.filter((skill) =>
    profileSkills.map((s) => s.toLowerCase()).includes(String(skill).toLowerCase())
  ).length;
  const matchPercent = jobSkills.length ? Math.round((overlap / jobSkills.length) * 100) : 0;

  await query(
    `INSERT INTO applications (user_id, job_id, resume_url, note, match_percent)
     VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, jobId, resume_url || profileRows[0]?.resume_url || null, note, matchPercent]
  );

  return res.status(201).json({ message: "Application submitted", matchPercent });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["submitted", "shortlisted", "rejected", "hired"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appRows = await query(
    `SELECT a.id
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.id = ? AND j.posted_by = ?`,
    [req.params.applicationId, req.user.id]
  );

  if (appRows.length === 0 && req.user.role !== "admin") {
    return res.status(404).json({ message: "Application not found" });
  }

  await query("UPDATE applications SET status = ? WHERE id = ?", [status, req.params.applicationId]);

  return res.json({ message: "Application status updated" });
});
