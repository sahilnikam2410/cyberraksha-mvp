import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { ShieldCheck, Lock, Mail, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password
      });

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

      // ✅ Only ADMIN / ANALYST allowed
      if (user.role !== "ADMIN" && user.role !== "ANALYST") {
        setError("Access denied: You are not an Admin/Analyst.");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_profile", JSON.stringify(user));

      nav("/admin/dashboard");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050a14] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
            <ShieldCheck />
          </div>
          <div>
            <h1 className="text-2xl font-black">CyberRaksha Admin</h1>
            <p className="text-white/60 text-sm">
              Secure SOC Dashboard Login (JWT)
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 flex gap-2">
            <AlertTriangle size={18} className="mt-[2px]" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-white/80">
              Admin Email
            </label>
            <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Mail size={18} className="text-white/60" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cyberraksha.com"
                className="w-full bg-transparent outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-white/80">
              Password
            </label>
            <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Lock size={18} className="text-white/60" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                type="password"
                className="w-full bg-transparent outline-none text-white"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-xs text-white/50 text-center">
            Only ADMIN / ANALYST roles can access SOC dashboard.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
