import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LogOut, User, LayoutDashboard, Siren } from "lucide-react";
import { getToken, getUser, logout } from "../utils/auth";

function NavLink({ to, label, icon, active }) {
  return (
    <Link
      to={to}
      className={`group relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all
      ${
        active
          ? "bg-gray-900 text-white shadow"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>

      {!active && (
        <span className="absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-gray-900 opacity-0 group-hover:opacity-100 transition" />
      )}
    </Link>
  );
}

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const token = getToken();
  const user = getUser();

  const isAdmin = useMemo(() => {
    return token && (user?.role === "ADMIN" || user?.role === "ANALYST");
  }, [token, user]);

  const isUser = useMemo(() => {
    return token && user?.role === "USER";
  }, [token, user]);

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="sticky top-0 z-50">
      {/* Premium glass bar */}
      <div className="w-full border-b bg-white/75 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow">
              <Shield size={22} />
            </div>

            <div className="leading-tight">
              <div className="font-black text-xl tracking-tight">
                CyberRaksha
              </div>
              <div className="text-xs font-medium text-gray-500">
                Scam se Suraksha. Digital Raksha.
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/report"
              label="Scam Check"
              icon={<Shield size={16} />}
              active={isActive("/report")}
            />

            <NavLink
              to="/pricing"
              label="Pricing"
              icon={<LayoutDashboard size={16} />}
              active={isActive("/pricing")}
            />

            <NavLink
              to="/emergency"
              label="Emergency"
              icon={<Siren size={16} />}
              active={isActive("/emergency")}
            />

            {/* USER */}
            {isUser && (
              <NavLink
                to="/portal"
                label="My Portal"
                icon={<User size={16} />}
                active={isActive("/portal")}
              />
            )}

            {/* ADMIN */}
            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                label="SOC"
                icon={<LayoutDashboard size={16} />}
                active={isActive("/admin/dashboard")}
              />
            )}
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-2">
            {token ? (
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="px-4 py-2 rounded-2xl bg-gray-900 text-white font-semibold text-sm shadow hover:opacity-95 transition inline-flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl border bg-white hover:bg-gray-50 text-sm font-semibold transition"
                >
                  User Login
                </Link>

                <Link
                  to="/admin/login"
                  className="px-4 py-2 rounded-2xl bg-gray-900 text-white text-sm font-semibold shadow hover:opacity-95 transition"
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mobile Quick Links */}
      <div className="md:hidden w-full bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          <Link
            to="/report"
            className="px-4 py-2 rounded-2xl border text-sm font-semibold whitespace-nowrap"
          >
            Scam Check
          </Link>

          <Link
            to="/pricing"
            className="px-4 py-2 rounded-2xl border text-sm font-semibold whitespace-nowrap"
          >
            Pricing
          </Link>

          <Link
            to="/emergency"
            className="px-4 py-2 rounded-2xl border text-sm font-semibold whitespace-nowrap"
          >
            Emergency
          </Link>

          {isUser && (
            <Link
              to="/portal"
              className="px-4 py-2 rounded-2xl border text-sm font-semibold whitespace-nowrap"
            >
              My Portal
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded-2xl border text-sm font-semibold whitespace-nowrap"
            >
              SOC
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
