import { Router } from "express";
import {
  createJob,
  getJobById,
  listJobs,
  listSavedJobs,
  saveJob
} from "../controllers/jobController.js";
import { applyToJob } from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

router.get("/", listJobs);
router.get("/saved/me", requireAuth, allowRoles("job_seeker"), listSavedJobs);
router.get("/:id", getJobById);
router.post("/", requireAuth, allowRoles("job_poster", "admin"), createJob);
router.post("/:id/save", requireAuth, allowRoles("job_seeker"), saveJob);
router.post("/:id/apply", requireAuth, allowRoles("job_seeker"), applyToJob);

export default router;
