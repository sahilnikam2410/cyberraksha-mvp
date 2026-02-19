import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { api, API_BASE } from "../utils/api";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  UploadCloud,
  CheckCircle2,
  Link2,
  Phone,
  User,
  CreditCard,
  MessageSquare
} from "lucide-react";

export default function Report() {
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    category: "WHATSAPP",
    message: "",
    link: "",
    upiId: "",
    suspectNumber: ""
  });

  const [screenshot, setScreenshot] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 }
  };

  const categoryTips = useMemo(() => {
    const c = form.category;
    if (c === "UPI")
      return "UPI fraud me mostly: collect request, fake QR, or urgent payment pressure hota hai.";
    if (c === "WHATSAPP")
      return "WhatsApp scams me: unknown link, OTP demand, fake courier, KYC, job scam common hai.";
    if (c === "INSTAGRAM")
      return "Instagram scams me: fake verified pages, giveaway, account hack, suspicious DM links.";
    if (c === "SMS")
      return "SMS me: fake bank message + link, parcel delivery, KYC update, prize scams.";
    if (c === "CALL")
      return "Call scam me: police/bank impersonation, remote app install, OTP demand.";
    return "Write details clearly. SOC will review your case.";
  }, [form.category]);

  function resetForm() {
    setForm({
      fullName: "",
      phone: "",
      category: "WHATSAPP",
      message: "",
      link: "",
      upiId: "",
      suspectNumber: ""
    });
    setScreenshot(null);
    setPreviewUrl("");
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setTicketId("");

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (screenshot) fd.append("screenshot", screenshot);

      const res = await api.post("/api/cases", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setTicketId(res.data.ticketId || "");
      resetForm();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit case");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-8">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08 }}
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white text-sm font-semibold">
              <ShieldAlert size={16} />
              Scam Check Portal
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-5 leading-tight">
              Report suspicious message, link or UPI.
              <span className="block text-gray-500">
                Get SOC reply inside portal.
              </span>
            </h2>

            <p className="text-gray-700 mt-4 text-lg">
              Submit details clearly. Screenshot optional.  
              CyberRaksha never asks for OTP, password, or remote access.
            </p>

            <div className="mt-6 bg-white rounded-3xl border shadow-sm p-5">
              <div className="font-black text-lg">Quick Tip</div>
              <div className="text-gray-700 mt-2 text-sm leading-relaxed">
                {categoryTips}
              </div>
            </div>

            {ticketId && (
              <motion.div
                variants={fadeUp}
                className="mt-6 bg-green-50 border border-green-200 rounded-3xl p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 />
                  <div>
                    <div className="font-black text-lg">
                      Case submitted successfully ✅
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Ticket ID: <b>{ticketId}</b>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      You can track reply inside <b>User Portal</b>.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* FORM */}
          <motion.div variants={fadeUp}>
            <form
              onSubmit={submit}
              className="bg-white rounded-[32px] shadow-md border p-6 md:p-8 space-y-5"
            >
              <div>
                <div className="text-2xl font-black">Submit Scam Report</div>
                <div className="text-sm text-gray-600 mt-1">
                  Max screenshot size: 2MB (png/jpg/webp)
                </div>
              </div>

              {/* Name + Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  icon={<User size={18} />}
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(v) => setForm({ ...form, fullName: v })}
                  required
                />

                <Field
                  icon={<Phone size={18} />}
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <div className="text-sm font-semibold mb-2">Category</div>
                <select
                  className="w-full border rounded-2xl px-4 py-3 bg-white"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="UPI">UPI</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="SMS">SMS</option>
                  <option value="CALL">Call</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  What happened? *
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-4 text-gray-400">
                    <MessageSquare size={18} />
                  </div>
                  <textarea
                    className="w-full border rounded-2xl pl-12 pr-4 py-3 min-h-[140px]"
                    placeholder="Paste message / explain what happened..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Link */}
              <Field
                icon={<Link2 size={18} />}
                placeholder="Suspicious Link (optional)"
                value={form.link}
                onChange={(v) => setForm({ ...form, link: v })}
              />

              {/* UPI + Suspect */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  icon={<CreditCard size={18} />}
                  placeholder="UPI ID (optional)"
                  value={form.upiId}
                  onChange={(v) => setForm({ ...form, upiId: v })}
                />

                <Field
                  icon={<Phone size={18} />}
                  placeholder="Suspect Phone Number (optional)"
                  value={form.suspectNumber}
                  onChange={(v) => setForm({ ...form, suspectNumber: v })}
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  Screenshot (optional)
                </div>

                <label className="w-full border-2 border-dashed rounded-3xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <UploadCloud size={28} />
                  <div className="mt-2 font-semibold">
                    Click to upload screenshot
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    png / jpg / webp (max 2MB)
                  </div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setScreenshot(file);

                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewUrl(url);
                      } else {
                        setPreviewUrl("");
                      }
                    }}
                  />
                </label>

                {screenshot && (
                  <div className="mt-3 text-sm text-gray-700">
                    Selected: <b>{screenshot.name}</b>
                  </div>
                )}

                {previewUrl && (
                  <div className="mt-4">
                    <div className="text-sm font-semibold">Preview</div>
                    <img
                      alt="preview"
                      src={previewUrl}
                      className="mt-2 rounded-3xl border w-full max-h-[320px] object-contain bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                className="w-full px-6 py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit for Scam Check"}
              </button>

              <div className="text-xs text-gray-600 leading-relaxed">
                🔒 CyberRaksha never asks for OTP/password and we do not take
                remote access.
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer strip */}
      <div className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>
            ⚡ Reports are stored securely and visible only to SOC team.
          </div>
          <div>
            Need to track case? Go to{" "}
            <a href="/login" className="text-blue-600 underline font-semibold">
              User Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, placeholder, value, onChange, required = false }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        required={required}
        className="w-full border rounded-2xl pl-12 pr-4 py-3"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
