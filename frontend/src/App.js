import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Report from "./pages/Report";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Portal from "./pages/Portal";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Emergency from "./pages/Emergency";

// ✅ IMPORTANT: filename must be PremiumLoader.js (Capital L)
import PremiumLoader from "./components/PremiumLoader";

// ✅ Premium ChatBot (all pages)
import PremiumChatBot from "./components/PremiumChatBot";

// ✅ FIXED IMPORT (inside src)
import { api, API_BASE } from "./utils/api";

// ✅ Loader Wrapper
function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // ✅ Route change loader
  useEffect(() => {
    setLoading(true);

    const t = setTimeout(() => {
      setLoading(false);
    }, 650); // Premium feel

    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      {/* ✅ Loader Overlay */}
      <PremiumLoader show={loading} text="AI scanning..." />

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/report" element={<Report />} />

        {/* USER */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/portal" element={<Portal />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Emergency */}
        <Route path="/emergency" element={<Emergency />} />

        {/* Fix */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>

      {/* ✅ Chatbot always on every page */}
      <PremiumChatBot />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
