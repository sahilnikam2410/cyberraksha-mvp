import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { api, API_BASE } from "../utils/api";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  PlusCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Phone,
  AlertTriangle,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function Portal() {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);

  // Report form states
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("WHATSAPP");
  const [message, setMessage] = useState("");
  const [suspectNumber, setSuspectNumber] = useState("");
  const [link, setLink] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  // UI
  const [activeTab, setActiveTab] = useState("REPORT"); // REPORT | MY
  const [expandedCaseId, setExpandedCaseId] = useState(null);

  function getTokenOrRedirect() {
    const token = localStorage.getItem("user_token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return token;
  }

  async function loadMyCases() {
    const token = getTokenOrRedirect();
    if (!token) return;

    const res = await api.get("/api/portal/my-cases", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setCases(res.data || []);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await loadMyCases();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  function logout() {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_profile");
    window.location.href = "/";
  }

  async function submitCase(e) {
    e.preventDefault();

    const token = getTokenOrRedirect();
    if (!token) return;

    if (!message.trim()) {
      alert("Please enter your message");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("category", category);
      form.append("message", message);
      form.append("suspectNumber", suspectNumber);
      form.append("link", link);

      if (screenshot) form.append("screenshot", screenshot);

      await api.post("/api/portal/report", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      // reset
      setCategory("WHATSAPP");
      setMessage("");
      setSuspectNumber("");
      setLink("");
      setScreenshot(null);

      alert("Report submitted ✅");

      // refresh
      await loadMyCases();

      // move to My Reports tab
      setActiveTab("MY");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to submit report ❌");
    } finally {
      setSubmitting(false);
    }
  }

  const stats = useMemo(() => {
    const total = cases.length;
    const newCount = cases.filter((c) => c.status === "NEW").length;
    const scamCount = cases.filter((c) => c.status === "SCAM").length;
    const safeCount = cases.filter((c) => c.status === "SAFE").length;

    return { total, newCount, scamCount, safeCount };
  }, [cases]);

  function statusBadge(status) {
    if (status === "SCAM")
      return "bg-red-50 text-red-700 border-red-200";
    if (status === "SUSPICIOUS")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (status === "SAFE")
      return "bg-green-50 text-green-700 border-green-200";
    if (status === "CLOSED")
      return "bg-gray-100 text-gray-700 border-gray-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  function severityBadge(sev) {
    if (sev === "HIGH") return "bg-red-50 text-red-700 border-red-200";
    if (sev === "MEDIUM")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white text-sm font-semibold">
              <ShieldCheck size={16} />
              User Portal Dashboard
            </div>

            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              My Portal 🛡️
            </h1>

            <p className="text-gray-600 mt-2">
              Report scams, upload screenshots, and see SOC reply instantly.
            </p>
          </div>

          <button
            onClick={logout}
            className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">Total Reports</div>
            <div className="text-3xl font-black mt-1">{stats.total}</div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">New</div>
            <div className="text-3xl font-black mt-1">{stats.newCount}</div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">Safe</div>
            <div className="text-3xl font-black mt-1">{stats.safeCount}</div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">Scam</div>
            <div className="text-3xl font-black mt-1">{stats.scamCount}</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 bg-white border rounded-3xl p-2 w-full md:w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("REPORT")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 ${
              activeTab === "REPORT"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            <PlusCircle size={18} />
            Report a Scam
          </button>

          <button
            onClick={() => setActiveTab("MY")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 ${
              activeTab === "MY"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            <Clock size={18} />
            My Reports
          </button>
        </div>

        {/* REPORT FORM */}
        {activeTab === "REPORT" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 bg-white rounded-[32px] shadow-md border p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-black">Report a Scam</div>
                <p className="text-gray-600 mt-1 text-sm">
                  Upload screenshot (optional). SOC will reply in portal.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border bg-gray-50">
                <AlertTriangle size={16} />
                Never share OTP / Password
              </div>
            </div>

            <form onSubmit={submitCase} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <div className="text-sm font-semibold mb-2">Category</div>
                  <select
                    className="w-full border rounded-2xl px-4 py-3 bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="WHATSAPP">WHATSAPP</option>
                    <option value="CALL">CALL</option>
                    <option value="SMS">SMS</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK">BANK</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="WEBSITE">WEBSITE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                {/* Suspect number */}
                <div>
                  <div className="text-sm font-semibold mb-2">
                    Suspect Number (optional)
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      className="w-full border rounded-2xl pl-12 pr-4 py-3"
                      placeholder="e.g. 9876543210"
                      value={suspectNumber}
                      onChange={(e) => setSuspectNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  What happened? *
                </div>
                <textarea
                  className="w-full border rounded-2xl px-4 py-3 min-h-[140px]"
                  placeholder="Explain the scam in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Link */}
              <div>
                <div className="text-sm font-semibold mb-2">
                  Scam Link (optional)
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <LinkIcon size={18} />
                  </div>
                  <input
                    className="w-full border rounded-2xl pl-12 pr-4 py-3"
                    placeholder="Paste link if any"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>

              {/* Screenshot */}
              <div className="bg-gray-50 border rounded-3xl p-5">
                <div className="flex items-center gap-2 font-bold">
                  <ImageIcon size={18} />
                  Screenshot (optional)
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="mt-3"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                />

                {screenshot ? (
                  <div className="mt-3 text-sm text-gray-700">
                    Selected: <b>{screenshot.name}</b>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-gray-500">
                    Max 2MB • png/jpg/webp
                  </div>
                )}
              </div>

              <button
                disabled={submitting}
                className="w-full px-6 py-4 rounded-2xl bg-gray-900 text-white font-black text-lg disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>

              <div className="text-xs text-gray-600 text-center">
                🔒 CyberRaksha never asks for OTP/password. No remote access.
              </div>
            </form>
          </motion.div>
        )}

        {/* MY REPORTS */}
        {activeTab === "MY" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-2xl font-black">My Reports</div>
                <p className="text-gray-600 mt-1 text-sm">
                  Tap any report to expand & view screenshot + SOC reply.
                </p>
              </div>

              <button
                onClick={loadMyCases}
                className="px-5 py-3 rounded-2xl border bg-white font-semibold hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="mt-6 text-gray-600">Loading...</div>
            ) : (
              <div className="mt-6 space-y-4">
                {cases.map((c) => {
                  const isOpen = expandedCaseId === c._id;

                  return (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-[32px] shadow-md border p-6"
                    >
                      <button
                        onClick={() =>
                          setExpandedCaseId(isOpen ? null : c._id)
                        }
                        className="w-full text-left"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <div className="text-xl font-black">
                              {c.ticketId}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {new Date(c.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`text-xs font-bold px-3 py-2 rounded-full border ${statusBadge(
                                c.status
                              )}`}
                            >
                              {c.status}
                            </span>

                            <span
                              className={`text-xs font-bold px-3 py-2 rounded-full border ${severityBadge(
                                c.severity
                              )}`}
                            >
                              {c.severity}
                            </span>

                            {c.analystReply ? (
                              <span className="text-xs font-bold px-3 py-2 rounded-full border bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                                <CheckCircle2 size={14} />
                                Replied
                              </span>
                            ) : (
                              <span className="text-xs font-bold px-3 py-2 rounded-full border bg-gray-50 text-gray-700 border-gray-200">
                                Waiting
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 text-sm">
                          <b>Your Message:</b>
                          <div className="mt-2 whitespace-pre-wrap text-gray-800">
                            {c.message}
                          </div>
                        </div>
                      </button>

                      {/* EXPANDED */}
                      {isOpen && (
                        <div className="mt-5 space-y-4">
                          {c.suspectNumber && (
                            <div className="text-sm">
                              <b>Suspect Number:</b> {c.suspectNumber}
                            </div>
                          )}

                          {c.link && (
                            <div className="text-sm">
                              <b>Link:</b>{" "}
                              <a
                                href={c.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                              >
                                {c.link}
                              </a>
                            </div>
                          )}

                          {/* SOC Reply */}
                          {c.analystReply ? (
                            <div className="border rounded-3xl p-5 bg-gray-50">
                              <div className="font-black text-lg">
                                SOC Reply
                              </div>
                              <div className="mt-2 whitespace-pre-wrap text-gray-800">
                                {c.analystReply}
                              </div>
                            </div>
                          ) : (
                            <div className="border rounded-3xl p-5 bg-gray-50 text-sm text-gray-700">
                              SOC reply pending. Please wait.
                            </div>
                          )}

                          {/* Screenshot */}
                          {c.screenshotUrl ? (
                            <div className="border rounded-3xl p-5">
                              <div className="font-black text-lg">
                                Screenshot Proof
                              </div>

                              <img
                                alt="screenshot"
                                className="mt-4 rounded-2xl border w-full max-w-[720px] object-contain bg-white"
                                src={`${API_BASE}${c.screenshotUrl}`}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />

                              <a
                                href={`${API_BASE}${c.screenshotUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline text-sm mt-3 inline-block"
                              >
                                Open Screenshot
                              </a>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              No screenshot uploaded.
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {cases.length === 0 && (
                  <div className="text-gray-600 mt-4">
                    No cases yet. Go to “Report a Scam” tab.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
