import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tag,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Boxes,
  LogOut,
  Settings,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navGroups = [
  {
    title: "Overview",
    links: [{ to: "/", name: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Quick Add",
    links: [
      { to: "/products/new", name: "New Product", icon: Plus, end: true },
      { to: "/brands/new", name: "New Brand", icon: Tag, end: true },
      { to: "/locations/new", name: "New Location", icon: MapPin, end: true },
    ],
  },
  {
    title: "Catalog",
    links: [
      { to: "/products", name: "Products", icon: Package, end: false },
      { to: "/brands", name: "Brands", icon: Tag, end: false },
      { to: "/locations", name: "Locations", icon: MapPin, end: false },
      { to: "/users", name: "Users", icon: Users, end: false },
    ],
  },
];

function SideNavbar({ collapsed, user }) {
  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)" }}>
          <Boxes size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-white text-sm whitespace-nowrap overflow-hidden"
            >
              Inventree
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-3 mb-4" />

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto px-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-3 mb-1"
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`
                  }
                  title={collapsed ? link.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <link.icon
                        size={16}
                        className={`flex-shrink-0 transition-colors ${isActive ? "text-brand-300" : ""}`}
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-3 mt-4" />

      {/* User + Logout */}
      <div className="p-2 mt-2">
        {user && !collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white/80 truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <LogoutButton collapsed={collapsed} />
      </div>
    </div>
  );
}

export default SideNavbar;
