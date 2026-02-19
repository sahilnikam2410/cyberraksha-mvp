import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

/**
 * PremiumLoader
 * - Fullscreen overlay loader
 * - Animated gradient background
 * - Floating particles
 * - Logo pulse + shine
 * - AI scanning text
 *
 * Usage:
 * <PremiumLoader show={loading} text="AI scanning..." />
 */

export default function PremiumLoader({ show = false, text = "Loading..." }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent flicker on initial render
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const particles = useMemo(() => {
    // Generate particles once
    const arr = [];
    for (let i = 0; i < 22; i++) {
      arr.push({
        id: i,
        size: Math.floor(Math.random() * 10) + 6,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 1.5
      });
    }
    return arr;
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[10px]" />

          {/* PREMIUM GRADIENT */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-transparent blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -right-40 h-[620px] w-[620px] rounded-full bg-gradient-to-tr from-indigo-500/40 via-purple-500/25 to-transparent blur-3xl animate-pulse" />

            {/* subtle moving shine */}
            <motion.div
              className="absolute inset-0 opacity-25"
              initial={{ x: "-35%" }}
              animate={{ x: "35%" }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)"
              }}
            />
          </div>

          {/* PARTICLES */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.top}%`
                }}
                initial={{ y: 0, opacity: 0.2 }}
                animate={{ y: [-8, 8, -8], opacity: [0.12, 0.28, 0.12] }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* MAIN CARD */}
          <motion.div
            initial={{ scale: 0.92, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="relative w-[92%] max-w-[520px]"
          >
            <div className="rounded-[34px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl p-7 md:p-9">
              {/* Logo */}
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative flex items-center justify-center h-20 w-20 rounded-3xl bg-white/10 border border-white/20 shadow-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* shine */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: [0.12, 0.35, 0.12] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 55%)"
                    }}
                  />

                  <Shield className="text-white" size={38} />
                </motion.div>
              </div>

              {/* Title */}
              <div className="mt-5 text-center">
                <div className="text-white text-2xl md:text-3xl font-black tracking-tight">
                  CyberRaksha
                </div>
                <div className="text-white/70 text-sm mt-1 font-medium">
                  Scam se Suraksha • Digital Raksha
                </div>
              </div>

              {/* AI scanning */}
              <div className="mt-7">
                <div className="flex items-center justify-center gap-2 text-white/85 font-semibold">
                  <span className="text-sm md:text-base">{text}</span>

                  <motion.span
                    className="inline-flex"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    •••
                  </motion.span>
                </div>

                {/* Progress bar */}
                <div className="mt-5 h-3 w-full rounded-full bg-white/10 border border-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white/70"
                    initial={{ x: "-60%" }}
                    animate={{ x: "60%" }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      width: "55%"
                    }}
                  />
                </div>

                {/* Tip */}
                <div className="mt-5 text-center text-xs text-white/70">
                  🔒 We never ask for OTP, password, or remote access.
                </div>
              </div>
            </div>

            {/* Footer glow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-16 rounded-full bg-white/10 blur-2xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
