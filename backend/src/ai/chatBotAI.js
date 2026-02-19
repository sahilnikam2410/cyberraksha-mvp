export function runChatBotAI(userMessage) {
  const msg = (userMessage || "").toLowerCase();

  // OTP / Password / Remote Access warning
  if (
    msg.includes("otp") ||
    msg.includes("password") ||
    msg.includes("remote") ||
    msg.includes("anydesk") ||
    msg.includes("teamviewer") ||
    msg.includes("screen share")
  ) {
    return `⚠️ IMPORTANT: CyberRaksha kabhi bhi OTP, password, ya remote access (AnyDesk/TeamViewer) nahi maangta.

Agar kisi ne OTP ya screen-share maanga hai → 99% scam hai.

✅ Safe Steps:
1) Immediately block number
2) Change passwords
3) Enable 2FA
4) Report on 1930 / cybercrime.gov.in`;
  }

  // UPI Fraud
  if (
    msg.includes("upi") ||
    msg.includes("qr") ||
    msg.includes("collect") ||
    msg.includes("request") ||
    msg.includes("pin")
  ) {
    return `🛡️ UPI Safety Tip:
Agar koi "Collect Request" bhej raha hai → usme PIN daloge toh paise CUT ho sakte hai.

✅ Safe:
- Never approve collect request
- Never scan unknown QR
- Always verify UPI ID before paying

Aap UPI ID yaha paste kar sakte ho, mai check kar dunga.`;
  }

  // WhatsApp link scam
  if (
    msg.includes("whatsapp") ||
    msg.includes("link") ||
    msg.includes("apk") ||
    msg.includes("telegram") ||
    msg.includes("download")
  ) {
    return `⚠️ WhatsApp / Link Scam Alert:
Unknown link / APK file = HIGH RISK.

✅ Safe Steps:
- Do NOT install any APK
- Check URL spelling (fake domains)
- Enable WhatsApp 2-step verification

Aap link yaha paste karo, mai risk analysis deta hu.`;
  }

  // Bank / Loan scam
  if (
    msg.includes("loan") ||
    msg.includes("bank") ||
    msg.includes("kyc") ||
    msg.includes("credit") ||
    msg.includes("debit") ||
    msg.includes("account")
  ) {
    return `⚠️ Bank / KYC Scam:
KYC update ke naam pe OTP / link = scam.

✅ Safe:
- Only use official bank app/website
- Never share OTP
- Never click SMS KYC links

Aap message paste karo, mai verify kar dunga.`;
  }

  // Instagram / Social account hack
  if (
    msg.includes("instagram") ||
    msg.includes("facebook") ||
    msg.includes("gmail") ||
    msg.includes("hack") ||
    msg.includes("account hacked")
  ) {
    return `🛡️ Account Security Help:
Agar account hack ho gaya hai toh:

✅ Steps:
1) Password change karo
2) 2FA enable karo
3) Login activity check karo
4) Unknown devices logout karo

Aap batao: Instagram/Gmail/WhatsApp?`;
  }

  // Default reply
  return `👋 Hello! Mai CyberRaksha AI Bot hu 🛡️

Aap mujhe ye batao:
1) Scam kis type ka hai? (WhatsApp / UPI / Call / SMS / Instagram)
2) Kya aapne koi OTP, PIN, ya payment kiya hai?

📌 Aap link, message, ya number paste karo — mai help karunga.`;
}
