import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Shield, Sparkles, Zap } from "lucide-react";

export default function Pricing() {
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Plans that protect your digital life 🛡️
          </motion.h2>

          <motion.p variants={fadeUp} className="text-gray-700 mt-3 text-lg">
            First time users: <b>₹99</b> for 1st month 🎉
          </motion.p>

          {/* Cards */}
          <motion.div
            variants={fadeUp}
            className="grid md:grid-cols-3 gap-6 mt-10"
          >
            <PlanCard
              title="Individual"
              price="₹199"
              subtitle="per month"
              icon={<Shield size={20} />}
              badge="Most Popular"
              items={[
                "Scam check (WhatsApp/SMS/Call)",
                "UPI/QR verification",
                "Account safety guidance",
                "SOC reply inside portal"
              ]}
              ctaLabel="Start Individual"
              ctaTo="/signup"
            />

            <PlanCard
              highlight
              title="Family Pack"
              price="₹499"
              subtitle="up to 5 members"
              icon={<Sparkles size={20} />}
              badge="Best Value"
              items={[
                "All Individual features",
                "Parents protection (senior safety)",
                "Kids safety guidance",
                "Priority SOC response"
              ]}
              ctaLabel="Choose Family Pack"
              ctaTo="/signup"
            />

            <PlanCard
              title="Premium"
              price="₹999"
              subtitle="priority support"
              icon={<Zap size={20} />}
              badge="Fastest"
              items={[
                "Emergency help guidance",
                "Fast replies",
                "Monthly safety reminders",
                "Case severity escalation"
              ]}
              ctaLabel="Go Premium"
              ctaTo="/signup"
            />
          </motion.div>

          {/* Note */}
          <motion.div
            variants={fadeUp}
            className="mt-10 bg-white rounded-3xl border shadow-sm p-5 text-sm text-gray-700"
          >
            ⚠️ <b>Note:</b> CyberRaksha provides scam guidance and verification.
            <br />
            We do <b>not</b> ask for OTP/password and we do <b>not</b> guarantee
            money recovery.
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between"
          >
            <div className="text-sm text-gray-600">
              Already submitted a case? Login and track SOC reply.
            </div>

            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl border bg-white font-semibold hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                to="/report"
                className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:opacity-90 transition"
              >
                Scam Check Now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  subtitle,
  items,
  ctaLabel,
  ctaTo,
  icon,
  badge,
  highlight = false
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.18 }}
      className={`rounded-[28px] border shadow-sm p-7 bg-white ${
        highlight ? "border-gray-900 shadow-md" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
          {icon}
        </div>

        {badge && (
          <div className="text-xs font-bold px-3 py-2 rounded-full border bg-gray-50">
            {badge}
          </div>
        )}
      </div>

      <div className="mt-5 font-black text-xl">{title}</div>

      <div className="mt-3">
        <div className="text-4xl font-black">{price}</div>
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        {items.map((t) => (
          <div key={t} className="flex items-start gap-2 text-gray-700">
            <div className="mt-[2px]">
              <Check size={16} />
            </div>
            <div>{t}</div>
          </div>
        ))}
      </div>

      <Link
        to={ctaTo}
        className={`mt-7 block text-center px-6 py-3 rounded-2xl font-semibold transition ${
          highlight
            ? "bg-gray-900 text-white hover:opacity-90"
            : "border bg-white hover:bg-gray-50"
        }`}
      >
        {ctaLabel}
      </Link>
    </motion.div>
  );
}
