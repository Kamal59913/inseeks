import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { useModalData } from "../../store/hooks";
import CommandPalette from "./CommandPalette";

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/home", icon: "fa-house", label: "Home" },
  { to: "/environments", icon: "fa-seedling", label: "Spaces" },
  { to: "/home/follow", icon: "fa-user-group", label: "Network" },
  { to: "/profile", icon: "fa-circle-user", label: "Profile" },
  { to: "/settings", icon: "fa-gear", label: "Settings" },
];

export default function LeftBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { open, close } = useModalData();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const signOut = async () => {
    try {
      await authService.logout().catch(() => {});
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const handleLogoutClick = () => {
    open("log-out", {
      title: "Are you sure you want to logout?",
      action: () => {
        signOut();
        close();
      },
    });
  };

  return (
    <>
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col shrink-0 w-60 h-screen bg-[#090e1a] border-r border-[#1f2e47] sticky top-0 py-6 px-3 gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-8 text-indigo-500">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
            <i className="fa-solid fa-seedling text-white text-sm"></i>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Inseeks
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-slate-400 hover:text-white hover:bg-[#1a2540]"
                  }`}
              >
                <i
                  className={`fa-solid ${icon} w-5 text-center ${
                    isActive
                      ? "text-indigo-400"
                      : "text-slate-500 group-hover:text-indigo-400"
                  } transition-colors`}
                ></i>
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full mt-auto"
        >
          <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
          Logout
        </button>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090e1a]/95 backdrop-blur-md border-t border-[#1f2e47] flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200
                ${isActive ? "text-indigo-400" : "text-slate-500"}`}
            >
              <i className={`fa-solid ${icon} text-lg`}></i>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogoutClick}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-all duration-200"
        >
          <i className="fa-solid fa-right-from-bracket text-lg"></i>
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </>
  );
}
