import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function buildWhereClause(filters, user) {
  const where = [];
  const params = [];

  if (user?.role !== "admin") {
    where.push("status = 'approved'");
  }

  if (filters.search) {
    where.push("(title LIKE ? OR company_name LIKE ? OR description LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.skills) {
    const splitSkills = filters.skills.split(",").map((s) => s.trim()).filter(Boolean);
    splitSkills.forEach((skill) => {
      where.push("skills_required LIKE ?");
      params.push(`%${skill}%`);
    });
  }

  if (filters.jobType) {
    where.push("job_type = ?");
    params.push(filters.jobType);
  }

  if (filters.location) {
    where.push("location_address LIKE ?");
    params.push(`%${filters.location}%`);
  }

  if (filters.companyName) {
    where.push("company_name LIKE ?");
    params.push(`%${filters.companyName}%`);
  }

  if (filters.sponsorship === "yes") {
    where.push("visa_sponsorship_available = 1");
  }

  if (filters.sponsorship === "no") {
    where.push("visa_sponsorship_available = 0");
  }

  if (filters.experienceRange) {
    const [min, max] = filters.experienceRange.split("-").map((n) => Number(n));
    if (!Number.isNaN(min)) {
      where.push("experience_min >= ?");
      params.push(min);
    }
    if (!Number.isNaN(max)) {
      where.push("experience_max <= ?");
      params.push(max);
    }
  }

  return {
    clause: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params
  };
}

export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company_name,
    description,
    skills_required = [],
    experience_min = 0,
    experience_max = 0,
    job_type,
    location_address,
    salary = null,
    referrer_name,
    referrer_email,
    referral_id = null,
    visa_sponsorship_available = false,
    application_deadline,
    openings = 1
  } = req.body;

  if (!title || !company_name || !description || !job_type || !location_address) {
    return res.status(400).json({ message: "Missing required job fields" });
  }

  const result = await query(
    `INSERT INTO jobs
    (title, company_name, description, skills_required, experience_min, experience_max, job_type, location_address,
      salary, referrer_name, referrer_email, referral_id, visa_sponsorship_available, application_deadline, openings, posted_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      company_name,
      description,
      JSON.stringify(skills_required),
      experience_min,
      experience_max,
      job_type,
      location_address,
      salary,
      referrer_name,
      referrer_email,
      referral_id,
      Boolean(visa_sponsorship_available),
      application_deadline,
      openings,
      req.user.id,
      req.user.role === "admin" ? "approved" : "pending"
    ]
  );

  return res.status(201).json({
    id: result.insertId,
    message: req.user.role === "admin" ? "Job posted" : "Job submitted for admin approval"
  });
});

export const listJobs = asyncHandler(async (req, res) => {
  const { clause, params } = buildWhereClause(req.query, req.user);
  const sortField = req.query.sort === "relevant" ? "updated_at" : "created_at";

  const jobs = await query(
    `SELECT id, title, company_name, location_address, experience_min, experience_max,
     skills_required, job_type, visa_sponsorship_available, status, created_at
     FROM jobs ${clause}
     ORDER BY ${sortField} DESC`,
    params
  );

  const normalized = jobs.map((job) => ({
    ...job,
    skills_required: job.skills_required ? JSON.parse(job.skills_required) : []
  }));

  res.json(normalized);
});

export const getJobById = asyncHandler(async (req, res) => {
  const jobs = await query(
    `SELECT j.*, u.name AS poster_name, u.email AS poster_email
     FROM jobs j
     JOIN users u ON u.id = j.posted_by
     WHERE j.id = ?`,
    [req.params.id]
  );

  if (jobs.length === 0) {
    return res.status(404).json({ message: "Job not found" });
  }

  const job = jobs[0];
  if (job.status !== "approved" && req.user?.role !== "admin" && req.user?.id !== job.posted_by) {
    return res.status(403).json({ message: "Job is not publicly available" });
  }

  res.json({
    ...job,
    skills_required: job.skills_required ? JSON.parse(job.skills_required) : []
  });
});

export const saveJob = asyncHandler(async (req, res) => {
  await query(
    "INSERT IGNORE INTO saved_jobs (user_id, job_id) VALUES (?, ?)",
    [req.user.id, req.params.id]
  );

  res.json({ message: "Job saved" });
});

export const listSavedJobs = asyncHandler(async (req, res) => {
  const saved = await query(
    `SELECT j.id, j.title, j.company_name, j.location_address, j.job_type, j.visa_sponsorship_available
     FROM saved_jobs sj
     JOIN jobs j ON j.id = sj.job_id
     WHERE sj.user_id = ?
     ORDER BY sj.created_at DESC`,
    [req.user.id]
  );

  res.json(saved);
});
