import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ScanLine,
  Bot,
  Sparkles,
  Lock,
  PhoneCall,
  Link2,
  QrCode
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="relative">
        {/* Gradient Glow Blobs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -top-52 -right-52 w-[520px] h-[520px] rounded-full bg-gradient-to-r from-emerald-200 via-cyan-200 to-blue-200 blur-[120px]"
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gray-300/50"
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 700,
                opacity: 0.2
              }}
              animate={{
                y: [Math.random() * 700, Math.random() * 700],
                x: [Math.random() * 1200, Math.random() * 1200],
                opacity: [0.15, 0.35, 0.15]
              }}
              transition={{
                duration: 8 + Math.random() * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10">
          {/* HERO CARD */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="bg-white/70 backdrop-blur-xl rounded-[36px] border shadow-xl p-8 md:p-12"
          >
            {/* Top Chips */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full border bg-white text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} />
                AI + SOC Powered Scam Protection
              </div>

              <div className="px-4 py-2 rounded-full border bg-white text-sm font-bold flex items-center gap-2">
                <Lock size={16} />
                No OTP • No Password • No Remote Access
              </div>
            </div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-8 text-5xl md:text-7xl font-black leading-[1.05] tracking-tight"
            >
              CyberRaksha{" "}
              <span className="inline-block align-middle">🛡️</span>
              <br />
              <span className="text-gray-700">
                Scam se Suraksha. Digital Raksha.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-5 text-lg md:text-xl text-gray-700 max-w-3xl"
            >
              Report suspicious messages, links, UPI IDs, or numbers.  
              Our SOC Team + AI gives you a clear response:
              <b> SAFE / SUSPICIOUS / SCAM</b>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/report"
                className="px-7 py-4 rounded-2xl bg-gray-900 text-white font-black shadow-lg hover:shadow-2xl hover:scale-[1.02] transition flex items-center gap-2"
              >
                <ScanLine size={18} />
                Check a Scam Now
              </Link>

              <Link
                to="/pricing"
                className="px-7 py-4 rounded-2xl border bg-white font-black hover:bg-gray-50 transition flex items-center gap-2"
              >
                View Plans
              </Link>

              <Link
                to="/signup"
                className="px-7 py-4 rounded-2xl border bg-white font-black hover:bg-gray-50 transition flex items-center gap-2"
              >
                Create Free Account
              </Link>
            </motion.div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="mt-7 text-sm text-gray-600 flex items-start gap-2"
            >
              ⚠️ CyberRaksha provides scam guidance and safety steps.  
              We don’t guarantee money recovery — but we help you act fast and smart.
            </motion.div>
          </motion.div>

          {/* FEATURE GRID */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <FeatureCard
              icon={<Bot size={22} />}
              title="AI Scam Assistant"
              desc="Chat + instant scam analysis + report auto-submit."
            />
            <FeatureCard
              icon={<QrCode size={22} />}
              title="UPI / QR Verification"
              desc="Detect collect request scams & fake QR tricks."
            />
            <FeatureCard
              icon={<Link2 size={22} />}
              title="Suspicious Link Check"
              desc="Find phishing, fake KYC, fake bank pages."
            />
            <FeatureCard
              icon={<PhoneCall size={22} />}
              title="Call & SMS Protection"
              desc="Report scam numbers and fraud SMS messages."
            />
          </motion.div>

          {/* TRUST STRIP */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-10 bg-white/70 backdrop-blur-xl rounded-[28px] border shadow-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div className="font-black text-lg flex items-center gap-2">
                <ShieldCheck size={20} />
                Trusted Safety Rules
              </div>
              <div className="text-sm text-gray-600 mt-1">
                We never ask OTP, password, or remote access. Only guidance.
              </div>
            </div>

            <Link
              to="/emergency"
              className="px-6 py-3 rounded-2xl bg-red-600 text-white font-black hover:scale-[1.02] transition shadow-md"
            >
              Emergency Help →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="bg-white/80 backdrop-blur-xl rounded-[28px] border shadow-md p-6"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow">
        {icon}
      </div>

      <div className="mt-4 font-black text-lg">{title}</div>
      <div className="mt-2 text-sm text-gray-600">{desc}</div>
    </motion.div>
  );
}
