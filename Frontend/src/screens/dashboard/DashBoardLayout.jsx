import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import HeaderBar from "../../components/HeaderBar";
import SideNavbar from "../../components/SideNavbar";
import { SERVER_URL } from "../../router";
import { Boxes, ShieldCheck, Sparkles, Clock, Database, Layers, CheckCircle2, Package, Tag, MapPin, ChevronRight } from "lucide-react";

function DashBoardLayout() {
  const navigator = useNavigate();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
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
      <div className="h-screen overflow-y-auto w-full text-white select-none relative scrollbar-thin" style={{ backgroundColor: "#06060a" }}>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-[450px] h-[450px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

        {/* Top Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/40 backdrop-blur-xl py-4 px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)" }}>
              <Boxes size={18} className="text-white" />
            </div>
            <span className="font-extrabold tracking-wide text-lg text-white">Inventree</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-white/60 hover:text-white text-sm font-semibold px-4 py-2 transition-all">
              Sign In
            </Link>
            <Link to="/auth/signup" className="btn-primary">
              Register
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300"
            >
              <Sparkles size={12} className="animate-spin-slow" />
              <span>AI-Powered Asset Intelligence</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15]"
            >
              Intelligent Inventory <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                Management for Teams
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed font-normal"
            >
              Audit equipment, track item lifecycles, configure multiple locations, and use advanced Gemini AI utilities to automatically generate catalogs, SEO copy, and pricing strategies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link to="/auth/signup" className="btn-primary py-3.5 px-6 rounded-2xl text-sm font-semibold flex items-center gap-2 group">
                Get Started Free
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/auth" className="btn-secondary py-3.5 px-6 rounded-2xl text-sm font-semibold">
                Sign In to Console
              </Link>
            </motion.div>

            {/* Quick Metrics Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 grid grid-cols-3 gap-6 max-w-lg border-t border-white/[0.06]"
            >
              <div>
                <h4 className="text-xl font-bold text-white">100%</h4>
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mt-1">Audit Traceability</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Gemini</h4>
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mt-1">Smart Engine</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Docker</h4>
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mt-1">Microservices</p>
              </div>
            </motion.div>
          </div>

          {/* Interactive Mockup */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-[420px]"
            >
              {/* Floating Element 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 z-20 bg-purple-500/20 backdrop-blur-lg border border-purple-500/30 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl shadow-purple-500/10"
              >
                <div className="h-8 w-8 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">AI Suggestion</div>
                  <div className="text-xs text-white font-semibold">Optimal Price: $1,250</div>
                </div>
              </motion.div>

              {/* Floating Element 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 z-20 bg-emerald-500/20 backdrop-blur-lg border border-emerald-500/30 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl shadow-emerald-500/10"
              >
                <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Status Check</div>
                  <div className="text-xs text-white font-semibold">120 Items Seeded</div>
                </div>
              </motion.div>

              {/* Core Mockup Frame */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="glass-card p-5 rounded-[28px] border border-white/[0.08] bg-[#0c0c14]/90 shadow-2xl shadow-black/50 space-y-4"
              >
                {/* Header Mock */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="bg-white/5 px-4 py-1 rounded-lg text-[10px] text-white/40 font-mono">console.inventree.local</div>
                </div>

                {/* Main Body Mock */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-white/50">Active Catalog</span>
                    <span className="text-[10px] bg-white/5 text-white/60 px-2 py-0.5 rounded-md">120 Products</span>
                  </div>

                  {/* List Mock */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-purple-400" />
                        <span className="text-xs font-semibold text-white/80">Dell PowerEdge R750</span>
                      </div>
                      <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Server</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-blue-400" />
                        <span className="text-xs font-semibold text-white/80">Cisco Catalyst 9300</span>
                      </div>
                      <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Switch</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-emerald-400" />
                        <span className="text-xs font-semibold text-white/80">MacBook Pro 16" M3</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Laptop</span>
                    </div>
                  </div>

                  {/* Valuation Progress Mock */}
                  <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl space-y-2">
                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>Warehouse Capacity</span>
                      <span className="text-white/70">65% Used</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </section>

        {/* Features / Details Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-white/[0.06] relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Full-Featured Asset Tracking</h2>
            <p className="text-sm text-white/40">
              Take complete control of your hardware inventory with a modern stack design tailored for developer and enterprise logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl space-y-4 hover:border-purple-500/20 hover:bg-white/[0.04] transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Package size={20} />
              </div>
              <h3 className="text-base font-semibold text-white">Asset Cataloging</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Add products, components, parts, models, and serial numbers. Maintain a clean manufacturer reference table.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl space-y-4 hover:border-blue-500/20 hover:bg-white/[0.04] transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-semibold text-white">AI Tools Engine</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Generate descriptions, SEO tags, marketing copy, margin-targeted pricing, and trending suggestions using Gemini 3.5.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl space-y-4 hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-semibold text-white">Movement Logs</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Audit device transfers across locations (e.g. Server Room A, Lab 3) with robust status tracking and warranty timers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl space-y-4 hover:border-red-500/20 hover:bg-white/[0.04] transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <Database size={20} />
              </div>
              <h3 className="text-base font-semibold text-white">Microservice Power</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Engineered with auth and product microservices, containerized with Docker, and routed through a single API Gateway.
              </p>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-white/[0.06] py-8 text-center text-xs text-white/20 relative z-10 bg-black/20">
          <p>© {new Date().getFullYear()} Inventree Platform. Powered by MERN Stack & Google Gemini AI.</p>
        </footer>

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
