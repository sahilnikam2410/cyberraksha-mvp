import express from "express";
import { runChatBotAI } from "../ai/chatBotAI.js";

const router = express.Router();

/**
 * POST /api/bot/chat
 * Body: { message: "..." }
 */
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = runChatBotAI(message);

    return res.json({ reply });
  } catch (err) {
    console.error("Bot error:", err);
    return res.status(500).json({ message: "Bot failed" });
  }
});

export default router;
