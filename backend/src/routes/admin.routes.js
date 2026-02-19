import express from "express";
import Case from "../models/Case.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

// ✅ AI Engine
import { runScamAI } from "../ai/scamAI.js";

const router = express.Router();

/**
 * ADMIN + ANALYST
 * - view all cases
 * - update case status/severity
 * - reply to user
 */

// ✅ Get all cases (SOC Dashboard)
router.get(
  "/cases",
  requireAuth,
  requireRole("ADMIN", "ANALYST"),
  async (req, res) => {
    try {
      const { status, severity, q } = req.query;

      const filter = {};

      if (status && status !== "ALL") filter.status = status;
      if (severity && severity !== "ALL") filter.severity = severity;

      if (q && q.trim()) {
        const s = q.trim();
        filter.$or = [
          { ticketId: { $regex: s, $options: "i" } },
          { fullName: { $regex: s, $options: "i" } },
          { phone: { $regex: s, $options: "i" } },
          { suspectNumber: { $regex: s, $options: "i" } }
        ];
      }

      const items = await Case.find(filter).sort({ createdAt: -1 }).lean();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  }
);

// ✅ Update case (status, severity, reply)
router.patch(
  "/cases/:id",
  requireAuth,
  requireRole("ADMIN", "ANALYST"),
  async (req, res) => {
    try {
      const { status, severity, analystReply, internalNotes } = req.body || {};

      const update = {};

      if (status) update.status = status;
      if (severity) update.severity = severity;

      if (typeof analystReply === "string") update.analystReply = analystReply;
      if (typeof internalNotes === "string")
        update.internalNotes = internalNotes;

      const updated = await Case.findByIdAndUpdate(req.params.id, update, {
        new: true
      }).lean();

      if (!updated) return res.status(404).json({ message: "Case not found" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update case" });
    }
  }
);

/**
 * 🤖 AI Suggest Reply (ADMIN + ANALYST)
 * GET /api/admin/cases/:id/ai-suggest
 */
router.get(
  "/cases/:id/ai-suggest",
  requireAuth,
  requireRole("ADMIN", "ANALYST"),
  async (req, res) => {
    try {
      const c = await Case.findById(req.params.id).lean();
      if (!c) return res.status(404).json({ message: "Case not found" });

      const ai = runScamAI(c);

      return res.json({
        status: ai.status,
        severity: ai.severity,
        confidence: ai.confidence,
        score: ai.score,
        autoReply: ai.autoReply
      });
    } catch (err) {
      console.error("AI suggest error:", err);
      return res.status(500).json({ message: "AI suggest failed" });
    }
  }
);

// ✅ Get all users (ADMIN only)
router.get("/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id name email role isActive createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
