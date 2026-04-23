import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "job_seeker" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );

  const token = signToken({ id: result.insertId, email, role });
  return res.status(201).json({
    token,
    user: { id: result.insertId, name, email, role }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const users = await query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = users[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

export const forgotPassword = asyncHandler(async (_req, res) => {
  return res.json({
    message: "Forgot password flow placeholder. Integrate email provider to issue reset links."
  });
});
