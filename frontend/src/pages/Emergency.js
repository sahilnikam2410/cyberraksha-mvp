import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { PhoneCall, ShieldAlert, FileText, Lock } from "lucide-react";

export default function Emergency() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-[32px] shadow-md border p-8 md:p-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-gray-50 text-sm font-semibold">
            <ShieldAlert size={16} />
            Emergency Help
          </div>

          <h1 className="text-4xl md:text-5xl font-black mt-5">
            Scam hua? Abhi action lo 🚨
          </h1>

          <p className="mt-3 text-gray-700 text-lg max-w-3xl">
            Agar aapka UPI / bank fraud / WhatsApp hack hua hai — panic mat karo.
            Neeche emergency steps follow karo.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="rounded-3xl border p-6">
              <div className="flex items-center gap-3 font-black text-xl">
                <PhoneCall size={22} />
                1930 Cyber Helpline
              </div>
              <p className="text-gray-600 mt-2">
                India me cyber fraud ke liye sabse fast helpline.
              </p>
              <div className="mt-4 text-sm font-semibold">
                Call ASAP: <span className="font-black">1930</span>
              </div>
            </div>

            <div className="rounded-3xl border p-6">
              <div className="flex items-center gap-3 font-black text-xl">
                <FileText size={22} />
                Report Online
              </div>
              <p className="text-gray-600 mt-2">
                National Cyber Crime Reporting Portal par complaint karo.
              </p>
              <div className="mt-4 text-sm font-semibold">
                Website:{" "}
                <span className="font-black">cybercrime.gov.in</span>
              </div>
            </div>

            <div className="rounded-3xl border p-6">
              <div className="flex items-center gap-3 font-black text-xl">
                <Lock size={22} />
                Account Secure
              </div>
              <p className="text-gray-600 mt-2">
                Bank/UPI pin change, WhatsApp logout, email password reset, 2FA
                enable.
              </p>
            </div>

            <div className="rounded-3xl border p-6">
              <div className="flex items-center gap-3 font-black text-xl">
                <ShieldAlert size={22} />
                Don’t Share OTP
              </div>
              <p className="text-gray-600 mt-2">
                CyberRaksha kabhi OTP / password / remote access nahi mangta.
              </p>
            </div>
          </div>

          <div className="mt-10 text-sm text-gray-700 bg-gray-50 border rounded-2xl p-4">
            ⚠️ Note: Agar money transfer hua hai, 30 minutes ke andar report karna
            best hota hai.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
