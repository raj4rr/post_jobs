import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const profiles = await query(
    `SELECT p.*, u.name, u.email
     FROM profiles p
     JOIN users u ON u.id = p.user_id
     WHERE p.user_id = ?`,
    [req.user.id]
  );

  if (profiles.length === 0) {
    return res.json({
      user_id: req.user.id,
      name: "",
      email: "",
      phone: "",
      location: "",
      experience_years: 0,
      skills: [],
      resume_url: "",
      education: "",
      work_experience: "",
      portfolio_url: ""
    });
  }

  const profile = profiles[0];
  return res.json({
    ...profile,
    skills: profile.skills ? JSON.parse(profile.skills) : []
  });
});

export const upsertMyProfile = asyncHandler(async (req, res) => {
  const {
    phone = "",
    location = "",
    experience_years = 0,
    skills = [],
    resume_url = "",
    education = "",
    work_experience = "",
    portfolio_url = ""
  } = req.body;

  const existing = await query("SELECT id FROM profiles WHERE user_id = ?", [req.user.id]);

  if (existing.length === 0) {
    await query(
      `INSERT INTO profiles
      (user_id, phone, location, experience_years, skills, resume_url, education, work_experience, portfolio_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        phone,
        location,
        experience_years,
        JSON.stringify(skills),
        resume_url,
        education,
        work_experience,
        portfolio_url
      ]
    );
  } else {
    await query(
      `UPDATE profiles
      SET phone=?, location=?, experience_years=?, skills=?, resume_url=?, education=?, work_experience=?, portfolio_url=?
      WHERE user_id=?`,
      [
        phone,
        location,
        experience_years,
        JSON.stringify(skills),
        resume_url,
        education,
        work_experience,
        portfolio_url,
        req.user.id
      ]
    );
  }

  return res.json({ message: "Profile saved successfully" });
});

export const getSeekerDashboard = asyncHandler(async (req, res) => {
  const [applied] = await Promise.all([
    query(
      `SELECT a.id, a.status, a.created_at, j.id AS job_id, j.title, j.company_name
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id]
    )
  ]);

  const saved = await query(
    `SELECT sj.id, sj.created_at, j.id AS job_id, j.title, j.company_name
     FROM saved_jobs sj
     JOIN jobs j ON j.id = sj.job_id
     WHERE sj.user_id = ?
     ORDER BY sj.created_at DESC`,
    [req.user.id]
  );

  const profile = await query("SELECT * FROM profiles WHERE user_id = ?", [req.user.id]);
  const profileCompletion = profile.length === 0
    ? 10
    : [
      profile[0].phone,
      profile[0].location,
      profile[0].skills,
      profile[0].resume_url,
      profile[0].education,
      profile[0].work_experience,
      profile[0].portfolio_url
    ].filter(Boolean).length * 14;

  res.json({ applied, saved, profileCompletion: Math.min(profileCompletion, 100) });
});

export const getPosterDashboard = asyncHandler(async (req, res) => {
  const postedJobs = await query(
    `SELECT j.*, COUNT(a.id) AS applicant_count
     FROM jobs j
     LEFT JOIN applications a ON a.job_id = j.id
     WHERE j.posted_by = ?
     GROUP BY j.id
     ORDER BY j.created_at DESC`,
    [req.user.id]
  );

  const applicants = await query(
    `SELECT a.id, a.status, a.created_at, u.name, u.email, p.resume_url, j.title AS job_title
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN users u ON u.id = a.user_id
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE j.posted_by = ?
     ORDER BY a.created_at DESC`,
    [req.user.id]
  );

  res.json({ postedJobs, applicants });
});
