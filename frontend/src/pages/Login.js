import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", form);

      localStorage.setItem("user_token", res.data.token);
      localStorage.setItem("user_profile", JSON.stringify(res.data.user));

      window.location.href = "/portal";
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white text-sm font-semibold">
              <ShieldCheck size={16} />
              Secure User Login
            </div>

            <h1 className="text-4xl md:text-5xl font-black mt-5 leading-tight">
              Welcome back to <span className="text-gray-500">CyberRaksha</span>
            </h1>

            <p className="text-gray-700 mt-4 text-lg">
              Login to track your scam reports and see SOC reply instantly.
            </p>

            <div className="mt-6 bg-white rounded-3xl border shadow-sm p-5">
              <div className="font-black text-lg">Safety Reminder</div>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                CyberRaksha kabhi bhi OTP, password, ya remote access nahi
                maangta. Agar koi aisa bole → 100% scam.
              </p>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <form
              onSubmit={submit}
              className="bg-white rounded-[32px] shadow-md border p-7 md:p-9 space-y-5"
            >
              <div>
                <div className="text-3xl font-black">User Login</div>
                <div className="text-sm text-gray-600 mt-1">
                  Access your portal & reports.
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <div className="text-sm font-semibold mb-2">Email</div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    className="w-full border rounded-2xl pl-12 pr-4 py-3"
                    placeholder="Enter email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="text-sm font-semibold mb-2">Password</div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    className="w-full border rounded-2xl pl-12 pr-4 py-3"
                    placeholder="Enter password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full px-6 py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* LINKS */}
              <div className="text-sm text-gray-600 text-center">
                New user?{" "}
                <a href="/signup" className="text-blue-600 underline font-semibold">
                  Create account
                </a>
              </div>

              <div className="text-xs text-gray-600 text-center leading-relaxed">
                🔒 Your login is protected. Token stored locally for portal access.
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>🛡️ CyberRaksha Security Portal</div>
          <div>
            Want to submit scam without login?{" "}
            <a href="/report" className="text-blue-600 underline font-semibold">
              Scam Check
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
