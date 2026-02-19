// backend/src/ai/scamAI.js

/**
 * CyberRaksha - Simple Rule Based AI
 * (No OpenAI yet - safe, offline, fast)
 *
 * Output:
 * - status: SAFE | SUSPICIOUS | SCAM
 * - severity: LOW | MEDIUM | HIGH
 * - confidence: 0-100
 * - score: number
 * - autoReply: string (WhatsApp/Email style)
 */

function normalizeText(str = "") {
  return String(str).toLowerCase().trim();
}

function containsAny(text, arr) {
  return arr.some((w) => text.includes(w));
}

export function runScamAI(caseData) {
  const message = normalizeText(caseData?.message || "");
  const link = normalizeText(caseData?.link || "");
  const suspectNumber = normalizeText(caseData?.suspectNumber || "");
  const upiId = normalizeText(caseData?.upiId || "");
  const category = normalizeText(caseData?.category || "");

  let score = 0;
  let flags = [];

  // 🚩 Strong scam keywords
  const strongKeywords = [
    "otp",
    "share otp",
    "send otp",
    "verification code",
    "remote access",
    "anydesk",
    "teamviewer",
    "quick support",
    "apk",
    "install app",
    "screen share",
    "bank account blocked",
    "kyc",
    "update kyc",
    "link expire",
    "click link",
    "urgent",
    "limited time",
    "gift",
    "reward",
    "lottery",
    "free recharge",
    "cashback",
    "refund",
    "blocked",
    "suspended",
    "police",
    "cyber crime",
    "customs",
    "parcel",
    "courier",
    "income tax",
    "upi pin",
    "pin",
    "cvv"
  ];

  // ⚠️ Medium risk words
  const mediumKeywords = [
    "payment failed",
    "collect request",
    "scan qr",
    "qr",
    "pay now",
    "offer",
    "job",
    "work from home",
    "investment",
    "trading",
    "telegram",
    "whatsapp group"
  ];

  // 🔗 Link check
  if (link) {
    score += 15;
    flags.push("Link shared");

    // suspicious shorteners
    if (containsAny(link, ["bit.ly", "tinyurl", "cutt.ly", "t.me"])) {
      score += 25;
      flags.push("Suspicious short link");
    }

    // http (not https)
    if (link.startsWith("http://")) {
      score += 15;
      flags.push("HTTP link (not secure)");
    }
  }

  // 📱 Suspect number
  if (suspectNumber && suspectNumber.length >= 8) {
    score += 10;
    flags.push("Suspect number provided");
  }

  // 🪙 UPI check
  if (upiId) {
    score += 10;
    flags.push("UPI ID shared");

    // fake looking UPI
    if (containsAny(upiId, ["@ok", "@upi", "@paytm", "@ybl", "@ibl"])) {
      score += 5;
    }
  }

  // 🧠 Keyword scoring
  if (containsAny(message, strongKeywords)) {
    score += 40;
    flags.push("Strong scam keywords found");
  }

  if (containsAny(message, mediumKeywords)) {
    score += 20;
    flags.push("Medium scam keywords found");
  }

  // Category based scoring
  if (category.includes("upi")) score += 10;
  if (category.includes("whatsapp")) score += 5;
  if (category.includes("call")) score += 10;
  if (category.includes("sms")) score += 10;

  // Screenshot present
  if (caseData?.screenshotUrl) {
    score += 5;
    flags.push("Screenshot uploaded");
  }

  // 🔥 Final classification
  let status = "SAFE";
  let severity = "LOW";

  if (score >= 70) {
    status = "SCAM";
    severity = "HIGH";
  } else if (score >= 40) {
    status = "SUSPICIOUS";
    severity = "MEDIUM";
  } else {
    status = "SAFE";
    severity = "LOW";
  }

  // Confidence
  let confidence = Math.min(95, Math.max(55, score));

  // 🤖 Auto reply generation
  let autoReply = "";

  if (status === "SCAM") {
    autoReply = `🚨 CyberRaksha SOC Update

Your report looks like a HIGH RISK scam.

✅ What to do now:
1) Do NOT share OTP / UPI PIN / passwords
2) Block the number and report on WhatsApp
3) If money is lost, call 1930 immediately
4) File report on https://cybercrime.gov.in

⚠️ If you clicked any link, change passwords + enable 2FA.

Stay safe 🛡️`;
  }

  if (status === "SUSPICIOUS") {
    autoReply = `⚠️ CyberRaksha SOC Update

Your report looks SUSPICIOUS.

✅ Safety steps:
1) Do NOT click any link again
2) Do NOT share OTP / UPI PIN
3) Verify from official app/website only
4) If payment done, contact bank + call 1930

We will keep monitoring this case. 🛡️`;
  }

  if (status === "SAFE") {
    autoReply = `✅ CyberRaksha SOC Update

Your report currently looks SAFE.

Still, follow safety:
1) Never share OTP / PIN
2) Always verify links from official sources
3) Enable 2FA on WhatsApp + Email

If you receive more messages from same person, report again. 🛡️`;
  }

  return {
    status,
    severity,
    confidence,
    score,
    flags,
    autoReply
  };
}
