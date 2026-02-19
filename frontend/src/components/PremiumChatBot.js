import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Copy,
  RotateCcw,
  Minus,
  Maximize2
} from "lucide-react";

/**
 * PremiumChatBot (Frontend only)
 * ✅ Mobile responsive (full width + safe bottom)
 * ✅ Desktop premium floating
 * ✅ No overflow / out-of-box bug
 * ✅ Typing animation
 * ✅ Quick actions
 */

const BRAND = {
  name: "CyberRaksha AI",
  subtitle: "AI Safety Assistant",
  tagline: "No OTP • No Password • No Remote Access"
};

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clean(s) {
  return (s || "").toString().trim();
}

function detectScamSignals(text) {
  const t = (text || "").toLowerCase();

  const scoreRules = [
    { k: ["otp", "one time password"], w: 40 },
    { k: ["anydesk", "teamviewer", "remote", "screen share"], w: 35 },
    { k: ["upi", "collect request", "pay request"], w: 25 },
    { k: ["kyc", "update kyc", "re-kyc"], w: 20 },
    { k: ["bank blocked", "account blocked", "freeze"], w: 25 },
    { k: ["link", "http", "bit.ly", "tinyurl", ".apk"], w: 25 },
    { k: ["urgent", "immediately", "within 5 minutes"], w: 10 },
    { k: ["reward", "lottery", "gift", "free"], w: 15 },
    { k: ["telegram", "whatsapp group", "investment"], w: 15 },
    { k: ["police", "cbi", "customs", "court"], w: 25 }
  ];

  let score = 0;
  let hits = [];

  scoreRules.forEach((r) => {
    if (r.k.some((x) => t.includes(x))) {
      score += r.w;
      hits.push(r.k[0]);
    }
  });

  if (score >= 80) return { level: "SCAM", score, hits };
  if (score >= 45) return { level: "SUSPICIOUS", score, hits };
  return { level: "SAFE", score, hits };
}

function buildReply(userText) {
  const { level, score, hits } = detectScamSignals(userText);

  const base =
    "Main CyberRaksha AI hoon. Main aapko scam se bachne ke liye safe guidance deta hoon. ";

  if (level === "SCAM") {
    return {
      level,
      title: "⚠️ High Risk Scam",
      body:
        base +
        "Is message/incident me scam signals strong hain. " +
        "Kisi ko OTP, password, UPI PIN bilkul mat do. Remote access apps (AnyDesk/TeamViewer) allow mat karo.\n\n" +
        "✅ Next steps:\n" +
        "1) UPI collect request decline karo\n" +
        "2) Bank/UPI app me transaction history check karo\n" +
        "3) 1930 par call karo (immediately)\n" +
        "4) CyberCrime portal par complaint karo\n" +
        "5) Suspect number block + report karo\n\n" +
        "🔍 Signals: " +
        (hits.length ? hits.join(", ") : "suspicious patterns"),
      footer: `Risk Score: ${score}/100`
    };
  }

  if (level === "SUSPICIOUS") {
    return {
      level,
      title: "🟡 Suspicious",
      body:
        base +
        "Ye suspicious lag raha hai. Aap safe side raho.\n\n" +
        "✅ Aap ye karo:\n" +
        "1) Link pe click mat karo\n" +
        "2) Sender ko official channel se verify karo\n" +
        "3) UPI ID / phone number ko cross-check karo\n" +
        "4) OTP / UPI PIN kabhi share mat karo\n\n" +
        "🔍 Signals: " +
        (hits.length ? hits.join(", ") : "some risk keywords"),
      footer: `Risk Score: ${score}/100`
    };
  }

  return {
    level,
    title: "🟢 Looks Safe (Basic)",
    body:
      base +
      "Abhi jo text aapne bheja usme strong scam signal nahi dikh raha.\n\n" +
      "✅ Still follow:\n" +
      "1) Unknown links avoid\n" +
      "2) OTP/UPI PIN never share\n" +
      "3) Payment before service avoid\n\n" +
      "Aap chahe toh screenshot ya link bhi submit kar sakte ho Scam Check page pe.",
    footer: `Risk Score: ${score}/100`
  };
}

function Bubble({ role = "ai", children }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed border whitespace-pre-wrap",
          isUser
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-900 border-gray-200"
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
      <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:120ms]" />
      <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:240ms]" />
    </div>
  );
}

export default function PremiumChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const [messages, setMessages] = useState(() => [
    {
      id: nowId(),
      role: "ai",
      text:
        "Hi 👋 Main CyberRaksha AI hoon.\n\nAap mujhe scam message, UPI collect request, suspicious link ya WhatsApp chat ka short summary bhejo.\n\nMain aapko SAFE / SUSPICIOUS / SCAM guidance dunga."
    }
  ]);

  const scrollRef = useRef(null);

  const quick = useMemo(
    () => [
      "Someone asked me OTP",
      "UPI Collect Request aaya",
      "WhatsApp link suspicious hai",
      "Bank KYC update message aaya",
      "Remote access app install karne bola"
    ],
    []
  );

  // ✅ Scroll to bottom
  useEffect(() => {
    if (!open || minimized) return;
    const t = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 80);
    return () => clearTimeout(t);
  }, [messages, open, minimized]);

  function closeBot() {
    setOpen(false);
    setMinimized(false);
  }

  function resetChat() {
    setMessages([
      {
        id: nowId(),
        role: "ai",
        text:
          "Chat reset ✅\n\nAap apna scam issue firse type karo. Main help karta hoon."
      }
    ]);
    setInput("");
  }

  async function send(text) {
    const t = clean(text);
    if (!t || busy) return;

    const userMsg = { id: nowId(), role: "user", text: t };
    setMessages((p) => [...p, userMsg]);
    setInput("");

    setBusy(true);

    // Typing placeholder
    const typingId = nowId();
    setMessages((p) => [
      ...p,
      { id: typingId, role: "ai", typing: true, text: "" }
    ]);

    // Simulated AI delay
    await new Promise((r) => setTimeout(r, 850));

    const ai = buildReply(t);

    const aiText =
      `${ai.title}\n\n` +
      `${ai.body}\n\n` +
      `—\n${ai.footer}\n\n` +
      `🛡️ Reminder: CyberRaksha never asks OTP / Password / Remote access.`;

    setMessages((p) => p.filter((m) => m.id !== typingId));
    setMessages((p) => [...p, { id: nowId(), role: "ai", text: aiText }]);

    setBusy(false);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function copyLastAI() {
    const lastAI = [...messages].reverse().find((m) => m.role === "ai" && m.text);
    if (!lastAI) return;
    navigator.clipboard.writeText(lastAI.text);
    alert("Copied ✅");
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="
          fixed bottom-5 right-5 z-[9999]
          px-5 py-4 rounded-full
          bg-gray-900 text-white shadow-2xl
          flex items-center gap-3 border border-gray-800
          sm:bottom-6 sm:right-6
        "
      >
        <MessageSquare size={18} />
        <span className="font-bold">Chat</span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-white/10">
          <Sparkles size={14} />
          AI
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="
              fixed z-[9999]
              bottom-0 right-0 left-0
              sm:bottom-24 sm:right-6 sm:left-auto
              w-full sm:w-[380px]
              max-w-full sm:max-w-[92vw]
            "
          >
            <div
              className="
                bg-white border shadow-2xl overflow-hidden
                rounded-t-[28px] sm:rounded-[28px]
              "
              style={{
                // iPhone notch safe bottom padding
                paddingBottom: "env(safe-area-inset-bottom)"
              }}
            >
              {/* Header */}
              <div className="relative p-4 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                      <Bot size={22} />
                    </div>

                    <div>
                      <div className="font-black text-base leading-tight">
                        {BRAND.name}
                      </div>
                      <div className="text-xs text-white/70">
                        {BRAND.subtitle} • {BRAND.tagline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMinimized((s) => !s)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold flex items-center gap-2"
                    >
                      {minimized ? (
                        <>
                          <Maximize2 size={14} />
                          Open
                        </>
                      ) : (
                        <>
                          <Minus size={14} />
                          Minimize
                        </>
                      )}
                    </button>

                    <button
                      onClick={closeBot}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
                      title="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              {!minimized && (
                <>
                  <div
                    ref={scrollRef}
                    className="
                      overflow-auto p-4
                      bg-gradient-to-b from-gray-50 to-white
                      h-[70vh] sm:h-[380px]
                    "
                  >
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <Bubble key={m.id} role={m.role}>
                          {m.typing ? <TypingDots /> : <span>{m.text}</span>}
                        </Bubble>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div className="mt-5">
                      <div className="text-xs font-bold text-gray-600 mb-2">
                        Quick Questions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quick.map((q) => (
                          <button
                            key={q}
                            onClick={() => send(q)}
                            className="text-xs px-3 py-2 rounded-full border bg-white hover:bg-gray-50 font-semibold"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-2 items-end">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Type your scam issue..."
                        className="
                          flex-1 border rounded-2xl px-4 py-3
                          min-h-[46px] max-h-[120px]
                          text-sm resize-none
                        "
                      />

                      <button
                        disabled={busy}
                        onClick={() => send(input)}
                        className="px-4 py-3 rounded-2xl bg-gray-900 text-white font-bold disabled:opacity-60 flex items-center gap-2"
                      >
                        <Send size={18} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex gap-2">
                        <button
                          onClick={copyLastAI}
                          className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-xs font-bold flex items-center gap-2"
                        >
                          <Copy size={14} />
                          Copy
                        </button>

                        <button
                          onClick={resetChat}
                          className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-xs font-bold flex items-center gap-2"
                        >
                          <RotateCcw size={14} />
                          Reset
                        </button>
                      </div>

                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-gray-500" />
                        Safe guidance only
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] text-gray-500 flex items-start gap-2">
                      <AlertTriangle size={14} className="mt-[2px]" />
                      If money is already sent, call <b>1930</b> immediately and
                      report on CyberCrime portal.
                    </div>
                  </div>
                </>
              )}

              {/* Minimized View */}
              {minimized && (
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <ShieldAlert size={18} />
                      Chat minimized
                    </div>

                    <button
                      onClick={() => setMinimized(false)}
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold text-sm"
                    >
                      Open
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Glow (desktop only) */}
            <div className="hidden sm:block pointer-events-none absolute -inset-3 -z-10 rounded-[34px] blur-2xl opacity-30 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
