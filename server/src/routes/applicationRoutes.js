import { Router } from "express";
import { updateApplicationStatus } from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

router.patch("/:applicationId/status", requireAuth, allowRoles("job_poster", "admin"), updateApplicationStatus);

export default router;
