import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Resume file is required" });
  }

  const baseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  const resumeUrl = `${baseUrl}/uploads/resumes/${req.file.filename}`;

  return res.status(201).json({
    message: "Resume uploaded successfully",
    resumeUrl
  });
});
