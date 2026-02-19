import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../config/upload.js";

import {
  getMyCases,
  createPortalCase
} from "../controllers/portal.controller.js";

const router = express.Router();

/**
 * GET /api/portal/my-cases
 * Logged-in user -> see own cases
 */
router.get("/my-cases", requireAuth, getMyCases);

/**
 * POST /api/portal/report
 * Logged-in user -> create a case + optional screenshot
 */
router.post(
  "/report",
  requireAuth,
  upload.single("screenshot"),
  createPortalCase
);

export default router;
