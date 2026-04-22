import { Router } from "express";
import {
  getMyProfile,
  getPosterDashboard,
  getSeekerDashboard,
  upsertMyProfile
} from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

router.get("/me", requireAuth, getMyProfile);
router.put("/me", requireAuth, allowRoles("job_seeker"), upsertMyProfile);
router.get("/dashboard/seeker", requireAuth, allowRoles("job_seeker"), getSeekerDashboard);
router.get("/dashboard/poster", requireAuth, allowRoles("job_poster", "admin"), getPosterDashboard);

export default router;
