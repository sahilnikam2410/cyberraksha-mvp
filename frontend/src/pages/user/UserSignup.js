import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { api } from "../../utils/api";
import { setAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function UserSignup() {
  const nav = useNavigate();
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
      setAuth(res.data.token, res.data.user);
      nav("/my");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-2xl font-black">Create Account</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create your CyberRaksha account to track cases.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              className="border rounded-2xl px-4 py-3 w-full"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="border rounded-2xl px-4 py-3 w-full"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="border rounded-2xl px-4 py-3 w-full"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              disabled={loading}
              className="w-full px-5 py-3 rounded-2xl bg-gray-900 text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Creating..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
