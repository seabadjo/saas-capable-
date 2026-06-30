import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { NAV } from "@/constants/testIds";

const links = [
  { to: "/features", label: "Fonctionnalités", id: NAV.linkFeatures },
  { to: "/solutions", label: "Solutions", id: NAV.linkSolutions },
  { to: "/pricing", label: "Tarifs", id: NAV.linkPricing },
  { to: "/contact", label: "Contact", id: NAV.linkContact },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = user && typeof user === "object";

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" data-testid={NAV.logo} className="flex items-center gap-2">
          <Logo size={34} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={l.id}
              className={`text-sm font-medium transition-colors duration-300 hover:text-[#22819A] ${
                location.pathname === l.to ? "text-[#22819A]" : "text-[#1F2937]/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthed ? (
            <>
              <button
                data-testid={NAV.dashboardBtn}
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-[#22819A] text-white text-sm font-medium hover:bg-[#1a6b82] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(34,129,154,0.3)] hover:-translate-y-0.5"
              >
                <LayoutDashboard size={16} strokeWidth={1.75} />
                Dashboard
              </button>
              <button
                data-testid={NAV.logoutBtn}
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[20px] border border-[#CDD4DD] text-sm text-[#1F2937] hover:border-[#22819A] transition-all duration-300"
              >
                <LogOut size={16} strokeWidth={1.75} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                data-testid={NAV.loginBtn}
                className="text-sm font-medium text-[#1F2937] hover:text-[#22819A] transition-colors duration-300"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                data-testid={NAV.registerBtn}
                className="px-5 py-2.5 rounded-[20px] bg-[#22819A] text-white text-sm font-medium hover:bg-[#1a6b82] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(34,129,154,0.3)] hover:-translate-y-0.5"
              >
                Commencer
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#CDD4DD]/60 bg-[#FEF7F8]">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#1F2937]"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3">
              {isAuthed ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/dashboard");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-[20px] bg-[#22819A] text-white text-sm font-medium"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-[20px] border border-[#CDD4DD] text-sm text-center"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-[20px] bg-[#22819A] text-white text-sm font-medium text-center"
                  >
                    Commencer
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
