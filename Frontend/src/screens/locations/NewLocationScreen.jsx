import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, FileText, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { SERVER_URL } from "../../router";

function NewLocationScreen() {
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({ name: "", description: "" });
  const [isError, setError] = useState("");

  function onchangeHandler(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setUploading(true);
    try {
      await axios.post(`${SERVER_URL}/api/v1/location/`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setData({ name: "", description: "" });
    } catch (e) {
      setError("Failed to create location. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">New Location</h1>
        <p className="text-sm text-white/40 mt-1">Add a new warehouse, office, or storage location</p>
      </motion.div>

      <AnimatePresence>
        {isError && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">
            <AlertCircle size={16} />{isError}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} />Location created successfully!</div>
            <Link to="/locations" className="text-xs underline text-emerald-300">View all locations →</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form onSubmit={handleSubmit} onChange={onchangeHandler}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-5">

        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-white/40 mb-1.5">Location Name *</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" name="name" id="name" value={data.name} required
              placeholder="e.g. Warehouse A, Room 302..." className="input-dark pl-9 w-full" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-white/40 mb-1.5">Description *</label>
          <div className="relative">
            <FileText size={14} className="absolute left-3 top-3.5 text-white/25" />
            <textarea name="description" id="description" value={data.description} required rows={3}
              placeholder="Brief description of this location..." className="input-dark pl-9 w-full resize-none" />
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06]">
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {uploading
              ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /><span>Saving...</span></>
              : <><Save size={16} /><span>Create Location</span></>}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

export default NewLocationScreen;
