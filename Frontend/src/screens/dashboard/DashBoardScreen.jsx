import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Package, Tag, MapPin, AlertTriangle, TrendingUp, TrendingDown,
  Activity, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import { SERVER_URL } from "../../router";
import { useOutletContext } from "react-router-dom";

// Skeleton component
const Skeleton = ({ className }) => (
  <div className={`skeleton ${className}`} />
);

// KPI Card
function KpiCard({ title, value, icon: Icon, trend, trendLabel, color, delay = 0 }) {
  const isPositive = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card-hover p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value ?? "—"}</p>
      <p className="text-sm text-white/40">{title}</p>
      {trendLabel && <p className="text-xs text-white/25 mt-1">{trendLabel}</p>}
    </motion.div>
  );
}

// Custom tooltip for charts
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs border border-white/10">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

function DashBoardScreen() {
  const [data] = useOutletContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${SERVER_URL}/api/v1/analytics/`)
      .then((r) => setAnalytics(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Build chart data from analytics
  const statusData = analytics?.status
    ? analytics.status.labels.map((l, i) => ({ name: l, value: analytics.status.data[i] }))
    : [];
  const expiryData = analytics?.expiry
    ? analytics.expiry.labels.map((l, i) => ({ name: l, count: analytics.expiry.data[i] }))
    : [];
  const usebyData = analytics?.useby
    ? analytics.useby.labels.map((l, i) => ({ name: l, value: analytics.useby.data[i] }))
    : [];

  const totalProducts = statusData.reduce((a, b) => a + b.value, 0);

  const kpis = [
    { title: "Total Products", value: totalProducts || "—", icon: Package, color: "#7c3aed", trend: 12, trendLabel: "vs last month" },
    { title: "Expiring Soon", value: expiryData[0]?.count ?? "—", icon: AlertTriangle, color: "#f59e0b", trend: -3, trendLabel: "warranty alerts" },
    { title: "Active Items", value: statusData.find(s => s.name?.toLowerCase().includes("active"))?.value ?? "—", icon: CheckCircle2, color: "#10b981", trend: 8, trendLabel: "in stock" },
    { title: "Use-By Critical", value: usebyData[0]?.value ?? "—", icon: Clock, color: "#ef4444", trend: -5, trendLabel: "need attention" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Welcome back, {data?.user?.name} 👋</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)
          : kpis.map((k, i) => <KpiCard key={k.title} {...k} delay={i * 0.08} />)
        }
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Inventory Status</h3>
              <p className="text-xs text-white/40 mt-0.5">{analytics?.status?.title}</p>
            </div>
            <Activity size={16} className="text-white/20" />
          </div>
          {loading ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Use-By Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Use-By Breakdown</h3>
              <p className="text-xs text-white/40 mt-0.5">{analytics?.useby?.title}</p>
            </div>
          </div>
          {loading ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={usebyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {usebyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Expiry Bar Chart + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expiry Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Warranty Expiry</h3>
              <p className="text-xs text-white/40 mt-0.5">{analytics?.expiry?.title}</p>
            </div>
            <span className="badge-yellow">Alerts</span>
          </div>
          {loading ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={expiryData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#f59e0b" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <span className="badge-purple">Live</span>
          </div>
          <div className="space-y-3">
            {loading ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-2.5 w-3/4" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
              </div>
            )) : (
              [
                { icon: Package, label: "New product added", sub: "2 minutes ago", color: "#7c3aed" },
                { icon: AlertTriangle, label: "Low stock alert", sub: "15 minutes ago", color: "#f59e0b" },
                { icon: CheckCircle2, label: "Inventory updated", sub: "1 hour ago", color: "#10b981" },
                { icon: Tag, label: "New brand registered", sub: "3 hours ago", color: "#3b82f6" },
                { icon: XCircle, label: "Item expired", sub: "Yesterday", color: "#ef4444" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                    <item.icon size={14} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 font-medium truncate">{item.label}</p>
                    <p className="text-xs text-white/30">{item.sub}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashBoardScreen;
