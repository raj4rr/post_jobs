import { Router } from "express";
import { uploadResume } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { resumeUpload } from "../middleware/upload.js";

const router = Router();

router.post(
  "/resume",
  requireAuth,
  allowRoles("job_seeker", "job_poster", "admin"),
  resumeUpload.single("resume"),
  uploadResume
);

export default router;
