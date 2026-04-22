import { Router } from "express";
import { adminAnalytics, listUsers, moderateJob } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

router.use(requireAuth, allowRoles("admin"));
router.get("/analytics", adminAnalytics);
router.get("/users", listUsers);
router.patch("/jobs/:id/moderate", moderateJob);

export default router;
