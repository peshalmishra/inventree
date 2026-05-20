import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, NavLink, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, ChevronLeft, ChevronRight, Package, Pencil, Clock, CheckCircle2, XCircle } from "lucide-react";
import { SERVER_URL } from "../../router";

const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

function ProductsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => { fetchData(); }, [currentPage, itemsPerPage, searchTerm]);

  async function fetchData() {
    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/products`, {
        params: { page: currentPage, itemsperpage: itemsPerPage, search: searchTerm },
      });
      setProducts(response.data.data);
      setTotalPages(response.data.pages_count);
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
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-white/40 mt-1">Manage your inventory items</p>
        </div>
        <Link to="new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /><span>New Product</span>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" placeholder="Search products..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="input-dark pl-9 py-2 text-xs w-full" />
          </div>
          <span className="text-xs text-white/30">{totalPages * itemsPerPage}+ items</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-dark">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th>#</th><th>Product</th><th>Serial No.</th><th>Used By</th>
                <th>Model</th><th>Warranty</th><th>Purchase Date</th><th>Flags</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={9} className="px-4 py-2"><Skeleton className="h-10 w-full" /></td></tr>
                ))
                : products.map((product, idx) => (
                  <ProductRow key={product._id} product={product} index={idx} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                ))
              }
              {!isLoading && products.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-white/30">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No products found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="input-dark py-1.5 text-xs w-auto px-2 rounded-lg">
              {[10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
            <span className="text-xs text-white/30">Page {currentPage} of {totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="btn-ghost py-1.5 px-3 flex items-center gap-1 text-xs disabled:opacity-30">
              <ChevronLeft size={14} />Prev
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
              className="btn-ghost py-1.5 px-3 flex items-center gap-1 text-xs disabled:opacity-30">
              Next<ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProductRow({ product, index, currentPage, itemsPerPage }) {
  const [_, user] = useOutletContext();
  const isOwner = user?._id === product.createdBy;
  const warrantyOk = product.warrantyMonths > 3;

  return (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
      <td className="px-4 py-3 text-xs text-white/30 font-mono">
        {index + 1 + (currentPage - 1) * itemsPerPage}
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{product.title}</p>
          <p className="text-xs text-white/30 mt-0.5">{product.manufacturer?.name}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-xs font-mono text-white/50">{product.serialNo}</td>
      <td className="px-4 py-3 text-xs text-white/50">{product.user || "—"}</td>
      <td className="px-4 py-3 text-xs text-white/50">{product.model}</td>
      <td className="px-4 py-3">
        <span className={warrantyOk ? "badge-green" : "badge-red"}>
          {product.warrantyMonths}mo
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-white/40">{product.dateOfPurchase?.split("T")[0]}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {product.isPart && <span className="badge-purple">Part</span>}
          {product.rackMountable && <span className="badge-yellow">Rack</span>}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to={`history/${product._id}`}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
            <Clock size={12} />History
          </Link>
          {isOwner && (
            <Link to={`edit/${product._id}`}
              className="flex items-center gap-1 text-xs text-white/40 hover:text-brand-300 transition-colors px-2 py-1 rounded-lg hover:bg-brand-400/10">
              <Pencil size={12} />Edit
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}

export default ProductsScreen;