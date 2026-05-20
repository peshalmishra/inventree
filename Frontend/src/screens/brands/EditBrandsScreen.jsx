import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, FileText, Save, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge";
import LoadingIndicator from "../../components/LoadingIndicator";
import { SERVER_URL } from "../../router";

function EditBrandsScreen() {
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({ name: "", description: "" });
  const [isError, setError] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, []);

  async function getDataFromApi() {
    try {
      setError("");
      const { data } = await axios.get(`${SERVER_URL}/api/v1/brands/${params.id}`);
      setData(data);
    } catch (e) {
      setError("Failed to fetch brand details.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onchangeHandler(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setUploading(true);
    try {
      await axios.patch(`${SERVER_URL}/api/v1/brands/${params.id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
    } catch (e) {
      setError("Failed to update brand.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Brand</h1>
        <p className="text-sm text-white/40 mt-1">Modify brand parameters</p>
      </motion.div>

      {isLoading && <LoadingIndicator />}

      <AnimatePresence>
        {isError && (
          <div className="mb-4">
            <ShowErrorMessage
              message={isError}
              children={
                <span className="underline cursor-pointer hover:text-red-300 transition-colors" onClick={getDataFromApi}>
                  Try Again
                </span>
              }
            />
          </div>
        )}
        {success && (
          <div className="mb-4">
            <ShowSuccessMesasge
              message="Brand updated successfully!"
              children={
                <Link className="underline text-emerald-300" to="/brands" replace={true}>
                  Go back to Brands
                </Link>
              }
            />
          </div>
        )}
      </AnimatePresence>

      {!isLoading && data && (
        <motion.form onSubmit={handleUpdate} onChange={onchangeHandler}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-5">

          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-white/40 mb-1.5">Brand Name *</label>
            <div className="relative">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input type="text" name="name" id="name" value={data.name} required
                placeholder="Brand Name" className="input-dark pl-9 w-full" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-white/40 mb-1.5">Description *</label>
            <div className="relative">
              <FileText size={14} className="absolute left-3 top-3.5 text-white/25" />
              <textarea name="description" id="description" value={data.description} required rows={3}
                placeholder="Brand Description" className="input-dark pl-9 w-full resize-none" />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {uploading
                ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /><span>Saving...</span></>
                : <><Save size={16} /><span>Update Brand</span></>}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}

export default EditBrandsScreen;
