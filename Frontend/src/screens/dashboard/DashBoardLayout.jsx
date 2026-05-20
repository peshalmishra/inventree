import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import HeaderBar from "../../components/HeaderBar";
import SideNavbar from "../../components/SideNavbar";
import { SERVER_URL } from "../../router";
import { Boxes } from "lucide-react";

function DashBoardLayout() {
  const navigator = useNavigate();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const { data, status } = await axios.get(`${SERVER_URL}/api/v1/users/me`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      if (status === 200) {
        setData(data);
        setUser(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const SIDEBAR_W = collapsed ? 64 : 220;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            <Boxes size={24} className="text-white" />
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-brand-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glass-card p-12 max-w-sm"
        >
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            <Boxes size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Inventree</h1>
          <p className="text-white/40 text-sm mb-8">Please sign in to continue managing your inventory.</p>
          <Link to="/auth" className="btn-primary inline-block">
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0a0f" }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: SIDEBAR_W }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="flex-shrink-0 h-full border-r border-white/[0.06] overflow-hidden"
        style={{ background: "rgba(13,13,20,0.95)" }}
      >
        <SideNavbar collapsed={collapsed} user={user} />
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <HeaderBar user={user} onToggleSidebar={() => setCollapsed((c) => !c)} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pt-14">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet context={[data, user]} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default DashBoardLayout;
