import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Megaphone, Wand2, Settings as SettingsIcon,
  LogOut, Bell, Search,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { DASH } from "@/constants/testIds";

const links = [
  { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, id: DASH.sidebarOverview, end: true },
  { to: "/dashboard/prospects", label: "Prospects", icon: Users, id: DASH.sidebarProspects },
  { to: "/dashboard/campaigns", label: "Campagnes", icon: Megaphone, id: DASH.sidebarCampaigns },
  { to: "/dashboard/ai-email", label: "IA Email", icon: Wand2, id: DASH.sidebarAiEmail },
  { to: "/dashboard/settings", label: "Paramètres", icon: SettingsIcon, id: DASH.sidebarSettings },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#FEF7F8]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-[#CDD4DD]">
        <div className="px-6 h-[72px] flex items-center border-b border-[#CDD4DD]">
          <Logo size={30} />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={l.id}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-[16px] text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#90C2E7]/20 text-[#22819A]"
                    : "text-[#1F2937]/75 hover:bg-[#FEF7F8] hover:text-[#22819A]"
                }`
              }
            >
              <l.icon size={18} strokeWidth={1.75} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-[#CDD4DD]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#90C2E7] to-[#22819A] text-white flex items-center justify-center font-semibold text-sm">
              {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#1F2937] truncate">{user?.name || "Utilisateur"}</div>
              <div className="text-xs text-[#1F2937]/60 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            data-testid="nav-logout-btn"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[14px] border border-[#CDD4DD] text-sm text-[#1F2937] hover:border-[#22819A] transition-all"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 h-[72px] glass border-b border-[#CDD4DD]/60 flex items-center px-6 lg:px-10 gap-4">
          <div className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F2937]/50" strokeWidth={1.75} />
            <input
              placeholder="Rechercher prospects, campagnes…"
              className="w-full pl-10 pr-4 py-2.5 rounded-[16px] bg-white border border-[#CDD4DD] text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent"
            />
          </div>
          <button className="h-10 w-10 rounded-[14px] bg-white border border-[#CDD4DD] flex items-center justify-center hover:border-[#22819A] transition-colors">
            <Bell size={16} strokeWidth={1.75} className="text-[#1F2937]/70" />
          </button>
        </header>
        <main className="flex-1 px-6 lg:px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
