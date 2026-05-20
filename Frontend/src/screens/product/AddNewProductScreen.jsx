import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Hash, Cpu, Calendar, Clock, Save, AlertCircle, CheckCircle2, MapPin, Building2, User, Activity, ArrowLeft } from "lucide-react";
import { SERVER_URL } from "../../router";
import LoadingIndicator from "../../components/LoadingIndicator";

const FormField = ({ label, icon: Icon, children }) => (
  <div>
    <label className="block text-xs font-semibold text-white/40 mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />}
      {React.cloneElement(children, { className: `${children.props.className} ${Icon ? "pl-9" : ""}` })}
    </div>
  </div>
);

function AddNewProductScreen() {
  const navigate = useNavigate();
  const [allLocations, setAllLocations] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [formData, setFormData] = useState({
    locationId: "",
    status: "not in use",
    title: "",
    description: "",
    serialNo: "",
    rackMountable: false,
    isPart: false,
    manufacturer: "",
    model: "",
    warrantyMonths: "",
    user: "department",
    dateOfPurchase: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    fetchNecessaryData();
  }, []);

  const fetchNecessaryData = async () => {
    try {
      setIsLoading(true);
      const manufacturersRes = await axios.get(`${SERVER_URL}/api/v1/brands`);
      const locationsRes = await axios.get(`${SERVER_URL}/api/v1/location`);
      setAllLocations(locationsRes.data);
      setManufacturer(manufacturersRes.data);
      if (locationsRes.data.length > 0 && manufacturersRes.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          manufacturer: manufacturersRes.data[0]._id,
          locationId: locationsRes.data[0]._id,
        }));
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to load brands or locations");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await axios.post(
        `${SERVER_URL}/api/v1/products`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Product added successfully");
      setFormData({
        locationId: allLocations[0]?._id || "",
        status: "not in use",
        title: "",
        description: "",
        serialNo: "",
        rackMountable: false,
        isPart: false,
        manufacturer: manufacturer[0]?._id || "",
        model: "",
        warrantyMonths: "",
        user: "department",
        dateOfPurchase: "",
      });
    } catch (error) {
      setError("Failed to add product. Please verify input data.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "input-dark w-full";
  const selectCls = "input-dark w-full appearance-none cursor-pointer";

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <Link to="/products" className="btn-ghost inline-flex items-center gap-2 text-xs">
        <ArrowLeft size={14} /> Back to products
      </Link>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <p className="text-sm text-white/40 mt-1">Populate details to add a new inventory product</p>
      </motion.div>

      {isLoading && allLocations.length === 0 && <LoadingIndicator />}

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">
            <AlertCircle size={16} />{error}
          </motion.div>
        )}
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} />{successMessage}</div>
            <Link to="/products" className="text-xs underline text-emerald-300">View products →</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {allLocations.length > 0 && (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-5">

          {/* Title + Serial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Title *" icon={Package}>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Dell PowerEdge" className={inputCls} />
            </FormField>
            <FormField label="Serial Number *" icon={Hash}>
              <input type="text" name="serialNo" value={formData.serialNo} onChange={handleChange} required placeholder="SN-..." className={inputCls} />
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Description *" icon={null}>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
              placeholder="Description" className="input-dark w-full resize-none" />
          </FormField>

          {/* Manufacturer + Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5">Manufacturer *</label>
              <select name="manufacturer" value={formData.manufacturer} onChange={handleChange} required className={selectCls}>
                {manufacturer.map((man) => (
                  <option key={man._id} value={man._id}>{man.name}</option>
                ))}
              </select>
            </div>
            <FormField label="Model *" icon={Cpu}>
              <input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="R740" className={inputCls} />
            </FormField>
          </div>

          {/* Date + Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date of Purchase *" icon={Calendar}>
              <input type="datetime-local" name="dateOfPurchase" value={formData.dateOfPurchase} onChange={handleChange} required className={inputCls} />
            </FormField>
            <FormField label="Warranty (months) *" icon={Clock}>
              <input type="number" name="warrantyMonths" value={formData.warrantyMonths} onChange={handleChange} required min={0} placeholder="36" className={inputCls} />
            </FormField>
          </div>

          {/* Location + User */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5">Location / Sector *</label>
              <select name="locationId" value={formData.locationId} onChange={handleChange} required className={selectCls}>
                {allLocations.map((loc) => (
                  <option key={loc._id} value={loc._id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5">User *</label>
              <select name="user" value={formData.user} onChange={handleChange} required className={selectCls}>
                <option value="department">Department</option>
                <option value="admin">Admin</option>
                <option value="normal user">Normal User</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required className={selectCls}>
                <option value="repair">Repair</option>
                <option value="not in use">Not In Use</option>
                <option value="in use">In Use</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-2">
            {[
              { name: "rackMountable", label: "Rack Mountable" },
              { name: "isPart", label: "Is Part" },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${formData[name] ? "bg-brand-500" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${formData[name] ? "translate-x-4" : "translate-x-0.5"}`} />
                  <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="sr-only" />
                </div>
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-white/[0.06]">
            <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {isLoading
                ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /><span>Adding...</span></>
                : <><Save size={16} /><span>Add Product</span></>}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}

export default AddNewProductScreen;
