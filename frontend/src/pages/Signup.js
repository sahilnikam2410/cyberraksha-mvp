import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function Signup() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/signup", form);

      localStorage.setItem("user_token", res.data.token);
      localStorage.setItem("user_profile", JSON.stringify(res.data.user));

      window.location.href = "/portal";
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
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
              Create Secure Account
            </div>

            <h1 className="text-4xl md:text-5xl font-black mt-5 leading-tight">
              Join <span className="text-gray-500">CyberRaksha</span> today 🛡️
            </h1>

            <p className="text-gray-700 mt-4 text-lg">
              Account bana ke aap apne scam reports track kar sakte ho, aur SOC
              ka reply portal me milta rahega.
            </p>

            <div className="mt-6 bg-white rounded-3xl border shadow-sm p-5">
              <div className="font-black text-lg">Why Signup?</div>
              <ul className="text-sm text-gray-700 mt-3 space-y-2">
                <li>✅ Your reports saved permanently</li>
                <li>✅ SOC reply directly in portal</li>
                <li>✅ Screenshot proof securely stored</li>
                <li>✅ Faster future scam verification</li>
              </ul>
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
                <div className="text-3xl font-black">Create Account</div>
                <div className="text-sm text-gray-600 mt-1">
                  Takes only 20 seconds 🚀
                </div>
              </div>

              {/* NAME */}
              <div>
                <div className="text-sm font-semibold mb-2">Full Name</div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    className="w-full border rounded-2xl pl-12 pr-4 py-3"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
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
                <div className="text-sm font-semibold mb-2">
                  Password (min 6)
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    className="w-full border rounded-2xl pl-12 pr-4 py-3"
                    placeholder="Create password"
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
                  "Creating..."
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* LINKS */}
              <div className="text-sm text-gray-600 text-center">
                Already have account?{" "}
                <a href="/login" className="text-blue-600 underline font-semibold">
                  Login
                </a>
              </div>

              <div className="text-xs text-gray-600 text-center leading-relaxed">
                🔒 We never ask OTP / password in chat. Only portal login.
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>🛡️ CyberRaksha User Signup Portal</div>
          <div>
            Already want to report scam?{" "}
            <a href="/report" className="text-blue-600 underline font-semibold">
              Scam Check
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
