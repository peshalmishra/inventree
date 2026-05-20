import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut } from "lucide-react";
import { SERVER_URL } from "../router";
import { motion, AnimatePresence } from "framer-motion";

function LogoutButton({ collapsed }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${SERVER_URL}/api/v1/users/logout`, {
        withCredentials: true,
      });
      navigate("/auth");
    } catch (e) {
      console.error(e);
      navigate("/auth");
    }
  };

  return (
    <button
      onClick={handleLogout}
      title={collapsed ? "Logout" : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/40 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 ${collapsed ? "justify-center" : ""}`}
    >
      <LogOut size={16} className="flex-shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            Log out
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default LogoutButton;
