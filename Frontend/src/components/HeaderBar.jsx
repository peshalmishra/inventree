import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronRight, Menu } from "lucide-react";
import { motion } from "framer-motion";

const routeLabels = {
  "/": "Dashboard",
  "/products": "Products",
  "/products/new": "New Product",
  "/brands": "Brands",
  "/brands/new": "New Brand",
  "/locations": "Locations",
  "/locations/new": "New Location",
  "/users": "User Management",
};

function HeaderBar({ user, onToggleSidebar }) {
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const pageTitle = routeLabels[location.pathname] ?? "Inventree";

  return (
    <header
      className="fixed top-0 right-0 left-0 z-30 flex items-center justify-between px-6 h-14 border-b border-white/[0.06]"
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)" }}
    >
      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          id="sidebar-toggle-btn"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-white/30">Inventree</span>
          <ChevronRight size={12} className="text-white/20" />
          <span className="text-white/80 font-medium">{pageTitle}</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center">
        <motion.div
          animate={{ width: searchFocused ? 300 : 220 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="input-dark pl-9 py-1.5 text-xs w-full"
            id="global-search-input"
          />
        </motion.div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        <button className="relative p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors" id="notifications-btn">
          <Bell size={16} />
          <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-brand-400" />
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-white/[0.08]">
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
            >
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-white/80 leading-none">{user.name}</p>
              <p className="text-[10px] text-white/40 leading-none mt-0.5">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderBar;
