import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { api } from "../../utils/api";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Backend route
      const res = await api.post("/api/auth/login", form);

      // Only allow admin / analyst
      if (res.data?.user?.role !== "ADMIN" && res.data?.user?.role !== "ANALYST") {
        alert("You are not allowed to access SOC Dashboard ❌");
        setLoading(false);
        return;
      }

      localStorage.setItem("user_token", res.data.token);
      localStorage.setItem("user_profile", JSON.stringify(res.data.user));

      window.location.href = "/admin/dashboard";
    } catch (err) {
      alert(err?.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT HERO */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white rounded-[36px] shadow-lg border p-8 md:p-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-gray-50 text-sm font-bold">
              <Shield size={18} />
              CyberRaksha SOC Access
            </div>

            <h1 className="text-4xl md:text-5xl font-black mt-6 leading-tight">
              Admin / Analyst Login 🧠🛡️
            </h1>

            <p className="text-gray-600 mt-4 text-lg">
              Secure access for SOC analysts to review scam reports, set status,
              and reply to users.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl border p-5">
                <div className="font-black flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Security Rule
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Never ask users for OTP, password, or remote access.
                </div>
              </div>

              <div className="rounded-3xl border p-5">
                <div className="font-black flex items-center gap-2">
                  <Lock size={18} />
                  SOC Workflow
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Review → classify SAFE/SCAM → reply → close case.
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT LOGIN FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="bg-white rounded-[36px] shadow-lg border p-8 md:p-10"
          >
            <div className="text-3xl font-black">SOC Login</div>
            <p className="text-gray-600 mt-2">
              Enter your admin credentials to continue.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              {/* EMAIL */}
              <div>
                <div className="text-sm font-bold mb-2">Email</div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    className="w-full border rounded-2xl pl-12 pr-4 py-3"
                    placeholder="admin@cyberraksha.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="text-sm font-bold mb-2">Password</div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>

                  <input
                    className="w-full border rounded-2xl pl-12 pr-12 py-3"
                    placeholder="Enter password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold text-lg disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login to SOC Dashboard"}
              </button>

              {/* FOOTER */}
              <div className="text-xs text-gray-600 mt-3">
                🔒 This portal is restricted to ADMIN / ANALYST only.
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
