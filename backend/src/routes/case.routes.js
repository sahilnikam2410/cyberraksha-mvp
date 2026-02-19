import express from "express";
import Case from "../models/Case.js";
import { upload } from "../config/upload.js";
import { makeTicketId } from "../utils/ticket.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/cases
 * Public allowed + logged in user allowed
 */
router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const {
      fullName,
      phone,
      category,
      message,
      link,
      upiId,
      suspectNumber
    } = req.body;

    if (!fullName || !phone || !message) {
      return res.status(400).json({ message: "Full name, phone, message required" });
    }

    const ticketId = makeTicketId();

    const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newCase = await Case.create({
      ticketId,
      fullName,
      phone,
      category,
      message,
      link,
      upiId,
      suspectNumber,
      screenshotUrl,
      status: "NEW",
      severity: "MEDIUM"
    });

    res.json({ ticketId: newCase.ticketId, case: newCase });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit case" });
  }
});

/**
 * GET /api/cases/ticket/:ticketId
 * user can check by ticket id
 */
router.get("/ticket/:ticketId", async (req, res) => {
  const c = await Case.findOne({ ticketId: req.params.ticketId });
  if (!c) return res.status(404).json({ message: "Ticket not found" });

  res.json({
    ticketId: c.ticketId,
    status: c.status,
    severity: c.severity,
    analystReply: c.analystReply || "",
    createdAt: c.createdAt
  });
});

export default router;
