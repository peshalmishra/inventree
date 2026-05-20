import axios from "axios";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Hash, Building2, Cpu, Calendar, Clock, CheckCircle2, AlertCircle, Server, Puzzle, Save } from "lucide-react";
import { SERVER_URL } from "../router";

const FormField = ({ label, icon: Icon, children }) => (
  <div>
    <label className="block text-xs font-semibold text-white/40 mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />}
      {React.cloneElement(children, { className: `${children.props.className} ${Icon ? "pl-9" : ""}` })}
    </div>
  </div>
);

function InventoryForm() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(null);
  const [isSuccess, setSuccess] = useState(false);
  const [data] = useOutletContext();

  const [formData, setFormData] = useState({
    createdBy: data.user._id,
    title: "", description: "", serialNo: "", manufacturer: "",
    model: "", dateOfPurchase: "", warrantyMonths: "", status: "none",
    user: "none", rackMountable: false, isPart: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { status } = await axios.post(`${SERVER_URL}/api/v1/products/`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      if (status === 201) {
        setSuccess(true);
        setFormData((prev) => ({
          ...prev, title: "", description: "", serialNo: "", manufacturer: "",
          model: "", dateOfPurchase: "", warrantyMonths: "", status: "none",
          user: "none", rackMountable: false, isPart: false,
        }));
      }
    } catch {
      setError("Failed to add product. Please check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "input-dark w-full";
  const selectCls = "input-dark w-full appearance-none cursor-pointer";

  return (
    <div className="p-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add Product</h1>
        <p className="text-sm text-white/40 mt-1">Add a new item to your inventory</p>
      </motion.div>

      <AnimatePresence>
        {isError && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">
            <AlertCircle size={16} className="flex-shrink-0" />{isError}
          </motion.div>
        )}
        {isSuccess && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
            <CheckCircle2 size={16} className="flex-shrink-0" />Product added to inventory successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-5">

        {/* Title + Serial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Product Title *" icon={Package}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Dell PowerEdge R740" className={inputCls} />
          </FormField>
          <FormField label="Serial Number *" icon={Hash}>
            <input type="text" name="serialNo" value={formData.serialNo} onChange={handleChange} required placeholder="e.g. SN-2024-001" className={inputCls} />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Description *" icon={null}>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
            placeholder="Brief description of the product..."
            className="input-dark w-full resize-none" />
        </FormField>

        {/* Manufacturer + Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Manufacturer *" icon={Building2}>
            <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required placeholder="e.g. Dell, HP, Cisco" className={inputCls} />
          </FormField>
          <FormField label="Model *" icon={Cpu}>
            <input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. R740xd" className={inputCls} />
          </FormField>
        </div>

        {/* Date + Warranty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date of Purchase *" icon={Calendar}>
            <input type="date" name="dateOfPurchase" value={formData.dateOfPurchase} onChange={handleChange} required className={inputCls} />
          </FormField>
          <FormField label="Warranty (months) *" icon={Clock}>
            <input type="number" name="warrantyMonths" value={formData.warrantyMonths} onChange={handleChange} required min={0} placeholder="e.g. 36" className={inputCls} />
          </FormField>
        </div>

        {/* Status + User */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={selectCls}>
              <option value="none">None</option>
              <option value="repair">Repair</option>
              <option value="in use">In Use</option>
              <option value="not in use">Not in Use</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5">Assigned User</label>
            <select name="user" value={formData.user} onChange={handleChange} className={selectCls}>
              <option value="none">None</option>
              <option value="Normal User">Normal User</option>
              <option value="department">Department</option>
              <option value="admin">Admin</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6 pt-2">
          {[
            { name: "rackMountable", label: "Rack Mountable", icon: Server },
            { name: "isPart", label: "Is Part / Component", icon: Puzzle },
          ].map(({ name, label, icon: Icon }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${formData[name] ? "bg-brand-500" : "bg-white/10"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${formData[name] ? "translate-x-4" : "translate-x-0.5"}`} />
                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="sr-only" />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors flex items-center gap-1.5">
                <Icon size={14} />{label}
              </span>
            </label>
          ))}
        </div>

        {/* Submit */}
        <div className="pt-2 border-t border-white/[0.06]">
          <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {isLoading
              ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /><span>Saving...</span></>
              : <><Save size={16} /><span>Add to Inventory</span></>}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

export default InventoryForm;
