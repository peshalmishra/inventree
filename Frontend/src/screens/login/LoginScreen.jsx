import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Boxes, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { SERVER_URL } from "../../router";

function LoginScreen() {
  const [formData, setData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleInputChange(e) {
    setData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, status } = await axios.post(`${SERVER_URL}/api/v1/users/login`, formData, {
        withCredentials: true,
      });
      if (status === 201) {
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      if (!err.response) {
        setError("Network error. Unable to connect to the server.");
      } else {
        setError(err.response.data?.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0a0f" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 glass-card overflow-hidden relative z-10">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="p-10 flex flex-col justify-between"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.08) 100%)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                <Boxes size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Inventree</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Smart Inventory<br />Management
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Track products, manage stock levels, monitor expiry dates, and get actionable insights — all in one place.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {["Real-time inventory tracking", "Warranty & expiry alerts", "Multi-user role management", "Analytics & reporting"].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-white/50">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="p-10 flex flex-col justify-center"
        >
          <h3 className="text-xl font-bold text-white mb-1">Welcome back</h3>
          <p className="text-sm text-white/40 mb-8">Sign in to your account to continue</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-white/40 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email" id="email" required placeholder="you@example.com"
                  onChange={handleInputChange}
                  className="input-dark pl-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-white/40 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPass ? "text" : "password"} id="password" required placeholder="••••••••"
                  onChange={handleInputChange}
                  className="input-dark pl-9 pr-9"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 mt-2 disabled:opacity-60">
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <><span>Sign In</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Don't have an account?{" "}
            <Link to="signup" className="text-brand-300 hover:text-brand-200 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginScreen;
