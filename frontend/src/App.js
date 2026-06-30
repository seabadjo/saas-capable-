import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/auth";

import Landing from "@/pages/Landing";
import Features from "@/pages/Features";
import Solutions from "@/pages/Solutions";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import Overview from "@/pages/dashboard/Overview";
import Prospects from "@/pages/dashboard/Prospects";
import Campaigns from "@/pages/dashboard/Campaigns";
import AIEmail from "@/pages/dashboard/AIEmail";
import Settings from "@/pages/dashboard/Settings";

function PublicLayout({ children }) {
  const { pathname } = useLocation();
  const hideChrome =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard");
  return (
    <>
      {!hideChrome && <Navbar />}
      <div className={!hideChrome ? "" : ""}>{children}</div>
      {!hideChrome && <Footer />}
    </>
  );
}

function AppRoutes() {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="ai-email" element={<AIEmail />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <div className="App min-h-screen bg-[#FEF7F8]">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "16px",
                border: "1px solid #CDD4DD",
                background: "#FFFFFF",
                color: "#1F2937",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
