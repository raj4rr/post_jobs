import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const moderateJob = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid moderation status" });
  }

  await query("UPDATE jobs SET status = ? WHERE id = ?", [status, req.params.id]);
  res.json({ message: `Job marked as ${status}` });
});

export const adminAnalytics = asyncHandler(async (_req, res) => {
  const [[users], [jobs], [applications], [pendingJobs]] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM users"),
    query("SELECT COUNT(*) AS count FROM jobs"),
    query("SELECT COUNT(*) AS count FROM applications"),
    query("SELECT COUNT(*) AS count FROM jobs WHERE status = 'pending'")
  ]);

  res.json({ users, jobs, applications, pendingJobs });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
  res.json(users);
});
