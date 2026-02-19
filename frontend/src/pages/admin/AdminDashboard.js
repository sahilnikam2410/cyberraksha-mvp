import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { api, API_BASE } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  X,
  Image as ImageIcon,
  MessageSquareText,
  FileText,
  Users,
  RefreshCcw,
  Save,
  Filter,
  Bot,
  Sparkles,
  LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);

  const [selected, setSelected] = useState(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [replyDraft, setReplyDraft] = useState("");
  const [notesDraft, setNotesDraft] = useState("");

  const [activeTab, setActiveTab] = useState("CASES"); // CASES | USERS

  // ✅ AI STATE
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // -----------------------------
  // Auth guard (extra safety)
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const profileRaw = localStorage.getItem("admin_profile");
    const profile = profileRaw ? JSON.parse(profileRaw) : null;

    if (!token || !profile || (profile.role !== "ADMIN" && profile.role !== "ANALYST")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_profile");
      nav("/admin/login");
    }
    // eslint-disable-next-line
  }, []);

  // ===== LOADERS =====
  async function loadCases() {
    const res = await api.get("/api/admin/cases", {
      params: {
        status: statusFilter,
        severity: severityFilter,
        q: search
      }
    });
    setCases(res.data || []);
  }

  async function loadUsers() {
    const res = await api.get("/api/admin/users");
    setUsers(res.data || []);
  }

  async function init() {
    setLoading(true);
    try {
      await Promise.all([loadCases(), loadUsers()]);
    } catch (err) {
      // 401 -> redirect
      if (err?.response?.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_profile");
        nav("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadCases();
    // eslint-disable-next-line
  }, [statusFilter, severityFilter]);

  const selectedCase = useMemo(() => {
    if (!selected) return null;
    return cases.find((c) => c._id === selected) || null;
  }, [selected, cases]);

  // ✅ reset drafts when selectedCase changes
  useEffect(() => {
    if (selectedCase) {
      setReplyDraft(selectedCase.analystReply || "");
      setNotesDraft(selectedCase.internalNotes || "");
    } else {
      setReplyDraft("");
      setNotesDraft("");
    }
  }, [selectedCase]);

  // ✅ clear AI result when case changes
  useEffect(() => {
    setAiResult(null);
    setAiLoading(false);
  }, [selected]);

  // ===== ACTIONS =====
  async function openCase(id) {
    setSelected(id);
  }

  async function updateSelectedCase(patch) {
    if (!selectedCase) return;

    const res = await api.patch(`/api/admin/cases/${selectedCase._id}`, patch);

    setCases((prev) =>
      prev.map((c) => (c._id === selectedCase._id ? res.data : c))
    );
  }

  async function saveReplyAndNotes() {
    if (!selectedCase) return;

    await updateSelectedCase({
      analystReply: replyDraft,
      internalNotes: notesDraft
    });

    alert("Reply saved ✅");
  }

  async function searchNow() {
    await loadCases();
  }

  async function refreshAll() {
    setLoading(true);
    try {
      await Promise.all([loadCases(), loadUsers()]);
    } finally {
      setLoading(false);
    }
  }

  function logoutAdmin() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    nav("/admin/login");
  }

  // ===== AI BUTTON =====
  async function generateAIReply() {
    if (!selectedCase) return;

    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await api.get(
        `/api/admin/cases/${selectedCase._id}/ai-suggest`
      );

      setAiResult(res.data);

      if (res.data?.autoReply) {
        setReplyDraft(res.data.autoReply);
      }

      if (res.data?.status) {
        await updateSelectedCase({ status: res.data.status });
      }
      if (res.data?.severity) {
        await updateSelectedCase({ severity: res.data.severity });
      }
    } catch (err) {
      console.log(err);
      alert("AI Suggest failed ❌");
    } finally {
      setAiLoading(false);
    }
  }

  // ===== UI HELPERS =====
  function statusBadge(status) {
    if (status === "SCAM") return "bg-red-50 text-red-700 border-red-200";
    if (status === "SUSPICIOUS")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (status === "SAFE") return "bg-green-50 text-green-700 border-green-200";
    if (status === "CLOSED") return "bg-gray-100 text-gray-700 border-gray-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  function severityBadge(sev) {
    if (sev === "HIGH") return "bg-red-50 text-red-700 border-red-200";
    if (sev === "MEDIUM")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  }

  const stats = useMemo(() => {
    const total = cases.length;
    const scam = cases.filter((c) => c.status === "SCAM").length;
    const suspicious = cases.filter((c) => c.status === "SUSPICIOUS").length;
    const safe = cases.filter((c) => c.status === "SAFE").length;

    return { total, scam, suspicious, safe };
  }, [cases]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white text-sm font-semibold">
              <ShieldAlert size={16} />
              SOC Admin Dashboard
            </div>

            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              CyberRaksha SOC 🧠🛡️
            </h1>

            <p className="text-gray-600 mt-2">
              Manage scam reports, reply to users, and track severity.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refreshAll}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>

            {/* ✅ Logout */}
            <button
              onClick={logoutAdmin}
              className="px-6 py-3 rounded-2xl border bg-white font-semibold flex items-center gap-2 hover:bg-gray-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">Total Cases</div>
            <div className="text-3xl font-black mt-1">{stats.total}</div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">SCAM</div>
            <div className="text-3xl font-black mt-1">{stats.scam}</div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">Suspicious</div>
            <div className="text-3xl font-black mt-1">{stats.suspicious}</div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-5">
            <div className="text-sm text-gray-600">Safe</div>
            <div className="text-3xl font-black mt-1">{stats.safe}</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 bg-white border rounded-3xl p-2 w-full md:w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("CASES")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 ${
              activeTab === "CASES"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            <FileText size={18} />
            Cases
          </button>

          <button
            onClick={() => setActiveTab("USERS")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 ${
              activeTab === "USERS"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            <Users size={18} />
            Users
          </button>
        </div>

        {/* CASES TAB */}
        {activeTab === "CASES" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6"
          >
            {/* Filters */}
            <div className="bg-white rounded-[32px] shadow-md border p-5 md:p-6">
              <div className="flex items-center gap-2 font-black text-lg">
                <Filter size={18} />
                Filters
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                <select
                  className="border rounded-2xl px-4 py-3 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  <option value="NEW">NEW</option>
                  <option value="SAFE">SAFE</option>
                  <option value="SUSPICIOUS">SUSPICIOUS</option>
                  <option value="SCAM">SCAM</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <select
                  className="border rounded-2xl px-4 py-3 bg-white"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>

                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </div>
                  <input
                    className="border rounded-2xl pl-12 pr-4 py-3 w-full"
                    placeholder="Search ticket/name/phone/suspect"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button
                  className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold"
                  onClick={searchNow}
                  disabled={loading}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Layout */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Case list */}
              <div className="bg-white rounded-[32px] shadow-md border p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="font-black text-xl">Cases</div>
                  <div className="text-sm text-gray-600">
                    {cases.length} total
                  </div>
                </div>

                <div className="mt-4 space-y-3 max-h-[640px] overflow-auto pr-2">
                  {cases.map((c) => (
                    <button
                      key={c._id}
                      className={`w-full text-left rounded-3xl border p-4 hover:bg-gray-50 transition ${
                        selected === c._id
                          ? "border-gray-900 bg-gray-50"
                          : ""
                      }`}
                      onClick={() => openCase(c._id)}
                    >
                      <div className="flex justify-between items-center gap-3">
                        <div className="font-black">{c.ticketId}</div>
                        <div className="flex gap-2 flex-wrap justify-end">
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
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mt-2">
                        {c.fullName} • {c.phone || "N/A"}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </button>
                  ))}

                  {cases.length === 0 && (
                    <div className="text-gray-600 mt-3">No cases found.</div>
                  )}
                </div>
              </div>

              {/* Case details */}
              <div className="bg-white rounded-[32px] shadow-md border p-5 md:p-6">
                {!selectedCase ? (
                  <div className="text-gray-600">
                    Select a case to view details.
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedCase._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-2xl font-black">
                            {selectedCase.ticketId}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {selectedCase.fullName} •{" "}
                            {selectedCase.phone || "N/A"} •{" "}
                            {selectedCase.category}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelected(null)}
                          className="p-2 rounded-xl border hover:bg-gray-50"
                          title="Close"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Status controls */}
                      <div className="mt-5 flex gap-3 flex-wrap">
                        <select
                          className="border rounded-2xl px-4 py-3"
                          value={selectedCase.status}
                          onChange={(e) =>
                            updateSelectedCase({ status: e.target.value })
                          }
                        >
                          <option value="NEW">NEW</option>
                          <option value="SAFE">SAFE</option>
                          <option value="SUSPICIOUS">SUSPICIOUS</option>
                          <option value="SCAM">SCAM</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>

                        <select
                          className="border rounded-2xl px-4 py-3"
                          value={selectedCase.severity}
                          onChange={(e) =>
                            updateSelectedCase({ severity: e.target.value })
                          }
                        >
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                        </select>

                        {/* ✅ AI Suggest Button */}
                        <button
                          onClick={generateAIReply}
                          disabled={aiLoading}
                          className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold flex items-center gap-2 disabled:opacity-60"
                        >
                          <Bot size={18} />
                          {aiLoading ? "AI Scanning..." : "AI Suggest Reply"}
                          <Sparkles size={16} className="opacity-80" />
                        </button>
                      </div>

                      {/* AI Result */}
                      {aiResult && (
                        <div className="mt-5 border rounded-3xl p-5 bg-gray-50">
                          <div className="font-black flex items-center gap-2">
                            <Sparkles size={18} />
                            AI Result
                          </div>

                          <div className="mt-3 text-sm text-gray-700">
                            <b>Status:</b> {aiResult.status} <br />
                            <b>Severity:</b> {aiResult.severity} <br />
                            <b>Confidence:</b> {aiResult.confidence}% <br />
                            <b>Score:</b> {aiResult.score}
                          </div>

                          <div className="mt-4 text-sm text-gray-800 whitespace-pre-wrap">
                            {aiResult.autoReply}
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div className="mt-6 border rounded-3xl p-5">
                        <div className="font-black flex items-center gap-2">
                          <MessageSquareText size={18} />
                          User Message
                        </div>

                        <div className="text-sm text-gray-800 mt-3 whitespace-pre-wrap">
                          {selectedCase.message}
                        </div>

                        {selectedCase.suspectNumber && (
                          <div className="text-sm mt-4">
                            <b>Suspect Number:</b> {selectedCase.suspectNumber}
                          </div>
                        )}

                        {selectedCase.link && (
                          <div className="text-sm mt-2">
                            <b>Link:</b>{" "}
                            <a
                              href={selectedCase.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                            >
                              {selectedCase.link}
                            </a>
                          </div>
                        )}

                        {selectedCase.screenshotUrl ? (
                          <div className="mt-5">
                            <div className="font-bold text-sm flex items-center gap-2">
                              <ImageIcon size={16} />
                              Screenshot
                            </div>

                            <img
                              alt="screenshot"
                              className="mt-3 rounded-2xl border w-full max-h-[320px] object-contain bg-white"
                              src={`${API_BASE}${selectedCase.screenshotUrl}`}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />

                            <a
                              href={`${API_BASE}${selectedCase.screenshotUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline text-sm mt-2 inline-block"
                            >
                              Open Screenshot
                            </a>
                          </div>
                        ) : (
                          <div className="mt-5 text-sm text-gray-500">
                            No screenshot uploaded.
                          </div>
                        )}
                      </div>

                      {/* Reply + Notes */}
                      <div className="mt-6 border rounded-3xl p-5 bg-gray-50">
                        <div className="font-black text-lg">
                          Reply to User (WhatsApp / Email style)
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          This reply will be visible to the user in their portal.
                        </p>

                        <textarea
                          className="mt-4 w-full border rounded-2xl px-4 py-3 min-h-[150px] bg-white"
                          placeholder="Type reply here..."
                          value={replyDraft}
                          onChange={(e) => setReplyDraft(e.target.value)}
                        />

                        <div className="mt-4 font-bold text-sm">
                          Internal Notes (SOC only)
                        </div>

                        <textarea
                          className="mt-2 w-full border rounded-2xl px-4 py-3 min-h-[90px] bg-white"
                          placeholder="Internal notes..."
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                        />

                        <button
                          className="mt-5 px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold flex items-center gap-2"
                          onClick={saveReplyAndNotes}
                        >
                          <Save size={18} />
                          Save Reply
                        </button>
                      </div>

                      {/* Warning */}
                      <div className="mt-6 text-xs text-gray-600 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Never ask user for OTP / password. Only provide guidance.
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* USERS TAB */}
        {activeTab === "USERS" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 bg-white rounded-[32px] shadow-md border p-5 md:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-black">Users</div>
                <p className="text-sm text-gray-600 mt-1">
                  Admin can view all registered users.
                </p>
              </div>

              <button
                onClick={loadUsers}
                className="px-5 py-3 rounded-2xl border bg-white font-semibold hover:bg-gray-50"
              >
                Refresh Users
              </button>
            </div>

            <div className="mt-6 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-3">Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="py-4 font-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="px-3 py-2 rounded-full border bg-gray-50 font-bold text-xs">
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border bg-green-50 text-green-700 border-green-200">
                            <ShieldCheck size={14} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border bg-red-50 text-red-700 border-red-200">
                            <ShieldAlert size={14} />
                            Disabled
                          </span>
                        )}
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-gray-600 mt-4">No users found.</div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
