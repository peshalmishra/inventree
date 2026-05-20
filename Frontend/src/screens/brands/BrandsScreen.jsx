import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Tag, User, Mail, Pencil } from "lucide-react";
import { SERVER_URL } from "../../router";

const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

function BrandsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isError, setError] = useState("");

  useEffect(() => { getDataFromApi(); }, []);

  async function getDataFromApi() {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/v1/brands`);
      setData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brands</h1>
          <p className="text-sm text-white/40 mt-1">Manage product manufacturers and brands</p>
        </div>
        <Link to="new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /><span>New Brand</span>
        </Link>
      </motion.div>

      {isError && (
        <div className="px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">{isError}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array(8).fill(0).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Skeleton className="h-44 rounded-2xl" />
            </motion.div>
          ))
          : data?.map((brand, i) => (
            <motion.div key={brand._id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <BrandCard data={brand} />
            </motion.div>
          ))
        }
        {!isLoading && data?.length === 0 && (
          <div className="col-span-full text-center py-16 text-white/30">
            <Tag size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No brands yet. Add your first brand!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BrandCard({ data }) {
  const actor = data.editedBy || data.createdBy;
  const label = data.editedBy ? "Edited by" : "Created by";

  return (
    <div className="glass-card-hover p-5 flex flex-col gap-3 h-full relative group">
      {/* Edit button */}
      <NavLink to={`edit/${data._id}`}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity btn-ghost py-1 px-2 text-xs flex items-center gap-1">
        <Pencil size={12} />Edit
      </NavLink>

      {/* Icon + Name */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.1))", border: "1px solid rgba(124,58,237,0.3)" }}>
          <Tag size={18} className="text-brand-300" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white truncate">{data.name}</h2>
          <span className="badge-purple text-[10px]">Brand</span>
        </div>
      </div>

      {data.description && (
        <p className="text-xs text-white/40 line-clamp-2 flex-1">{data.description}</p>
      )}

      {actor && (
        <div className="pt-3 border-t border-white/[0.06] space-y-1">
          <p className="text-[10px] text-white/25 uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
              {actor.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/60 truncate">{actor.name}</p>
              <p className="text-[10px] text-white/30 truncate">{actor.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandsScreen;
