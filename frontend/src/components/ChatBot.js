import React, { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  Sparkles,
  FilePlus2,
  ShieldAlert,
  ExternalLink
} from "lucide-react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);

  const [input, setInput] = useState("");

  // ✅ Auto Report Data
  const [autoReport, setAutoReport] = useState(null);
  const [creating, setCreating] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! Mai CyberRaksha AI Bot hu 🛡️\n\nAap scam ka message / link / UPI / number yaha paste karo.\nMai analysis + report ready kar dunga ✅"
    }
  ]);

  const boxRef = useRef(null);

  useEffect(() => {
    if (open && boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages, open, typing, autoReport]);

  function extractReportFields(text) {
    const msg = text || "";

    // Simple extraction
    const lower = msg.toLowerCase();

    let category = "OTHER";

    if (lower.includes("upi") || lower.includes("qr") || lower.includes("collect"))
      category = "UPI";
    else if (lower.includes("whatsapp")) category = "WHATSAPP";
    else if (lower.includes("sms")) category = "SMS";
    else if (lower.includes("call") || lower.includes("phone"))
      category = "CALL";
    else if (lower.includes("email") || lower.includes("gmail"))
      category = "EMAIL";
    else if (lower.includes("website") || lower.includes("http"))
      category = "WEBSITE";

    // Extract link
    const linkMatch = msg.match(/https?:\/\/[^\s]+/i);
    const link = linkMatch ? linkMatch[0] : "";

    // Extract phone number
    const phoneMatch = msg.match(/\b[6-9]\d{9}\b/);
    const suspectNumber = phoneMatch ? phoneMatch[0] : "";

    // Extract UPI ID
    const upiMatch = msg.match(/\b[a-z0-9.\-_]{2,}@[a-z]{2,}\b/i);
    const upiId = upiMatch ? upiMatch[0] : "";

    return {
      category,
      message: msg,
      link,
      suspectNumber,
      upiId
    };
  }

  async function send() {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    // reset auto report each time user sends new message
    setAutoReport(null);

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    setTyping(true);
    try {
      const res = await api.post("/api/bot/chat", { message: userText });
      const reply = res.data.reply || "Sorry, I couldn't understand.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);

      // ✅ Create auto-report suggestion
      const fields = extractReportFields(userText);

      // If message is too small, skip
      if (userText.length >= 12) {
        setAutoReport({
          ...fields
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text:
              "✅ Mai aapka report ready kar sakta hu.\n\n👇 नीचे button se report create kar do."
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ Bot is offline right now. Please try again later."
        }
      ]);
    } finally {
      setTyping(false);
    }
  }

  function getToken() {
    return localStorage.getItem("user_token");
  }

  async function createReportFromBot() {
    if (!autoReport) return;

    const token = getToken();
    if (!token) {
      alert("Please login first to submit report.");
      window.location.href = "/login";
      return;
    }

    setCreating(true);

    try {
      // Portal report endpoint requires auth
      const form = new FormData();
      form.append("category", autoReport.category || "OTHER");
      form.append("message", autoReport.message || "");
      form.append("suspectNumber", autoReport.suspectNumber || "");
      form.append("link", autoReport.link || "");

      // upiId is not in portal currently, but we can include in message
      // (optional)
      if (autoReport.upiId) {
        form.append(
          "message",
          `${autoReport.message}\n\n[Extracted UPI]: ${autoReport.upiId}`
        );
      }

      await api.post("/api/portal/report", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "✅ Report submitted successfully!\nअब aap Portal me ticket dekh sakte ho."
        }
      ]);

      setAutoReport(null);

      // redirect to portal
      setTimeout(() => {
        window.location.href = "/portal";
      }, 800);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to submit report from bot.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full px-5 py-4 bg-gray-900 text-white shadow-lg font-bold flex items-center gap-2 hover:scale-[1.02] transition"
        >
          <Bot size={20} />
          Chat
          <Sparkles size={18} />
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[92vw] bg-white border shadow-2xl rounded-3xl z-[9999]"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <div className="font-black flex items-center gap-2">
                  <Bot size={18} />
                  CyberRaksha AI
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Auto-report + Safety guidance
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl border hover:bg-gray-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={boxRef}
              className="p-4 space-y-3 h-[330px] overflow-auto"
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[86%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl text-sm bg-gray-100 text-gray-900">
                    Typing...
                  </div>
                </div>
              )}

              {/* Auto Report Card */}
              {autoReport && (
                <div className="mt-3 border rounded-3xl p-4 bg-white shadow-sm">
                  <div className="font-black flex items-center gap-2">
                    <FilePlus2 size={18} />
                    Auto Report Ready
                  </div>

                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <div>
                      <b>Category:</b> {autoReport.category}
                    </div>
                    {autoReport.suspectNumber && (
                      <div>
                        <b>Suspect:</b> {autoReport.suspectNumber}
                      </div>
                    )}
                    {autoReport.link && (
                      <div className="flex items-center gap-2">
                        <b>Link:</b>
                        <a
                          href={autoReport.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline inline-flex items-center gap-1"
                        >
                          Open <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={createReportFromBot}
                    disabled={creating}
                    className="mt-4 w-full px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold disabled:opacity-60"
                  >
                    {creating ? "Submitting..." : "Submit Report Now"}
                  </button>

                  <div className="mt-3 text-[11px] text-gray-600 flex items-center gap-2">
                    <ShieldAlert size={14} />
                    CyberRaksha never asks OTP/password.
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                className="flex-1 border rounded-2xl px-4 py-3"
                placeholder="Type your scam problem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />

              <button
                onClick={send}
                disabled={typing}
                className="px-4 py-3 rounded-2xl bg-gray-900 text-white font-bold disabled:opacity-60"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
