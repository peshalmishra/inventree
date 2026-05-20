import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Calendar, Clock, ChevronRight, AlertTriangle } from "lucide-react";
import { SERVER_URL } from "../router";
import LoadingIndicator from "./LoadingIndicator";

function WarrantyExpiringProductsTablesComponent({ uid }) {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/v1/analytics/expiring`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setInventoryData(data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setError("Error fetching inventory data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-400" />
          Warranty Expiring Soon
        </h3>
        <span className="text-[11px] font-medium badge-red">Attention Required</span>
      </div>

      {isLoading ? (
        <div className="p-8"><LoadingIndicator /></div>
      ) : isError ? (
        <div className="p-6 text-xs text-red-400 bg-red-400/10 text-center">{isError}</div>
      ) : inventoryData.length === 0 ? (
        <div className="p-12 text-center text-white/30 flex flex-col items-center justify-center gap-2">
          <AlertTriangle size={24} className="opacity-20" />
          <p className="text-xs">No items with expiring warranty.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-dark">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px]">
                <th>Product</th>
                <th>Serial Number</th>
                <th>Warranty / Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => {
                const statusName = item.history?.[0]?.status?.[0]?.name || "unknown";
                return (
                  <tr key={index} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-white/80">{item.title}</td>
                    <td className="px-4 py-3 text-[11px] font-mono text-white/40">{item.serialNo}</td>
                    <td className="px-4 py-3 text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-white/20" />
                        <span>{item.warrantyMonths}mo</span>
                        <span className="text-white/25">({item.dateOfPurchase?.split("T")[0]})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-purple text-[10px]">{statusName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/products/history/${item._id}`} className="text-[11px] font-medium text-brand-300 hover:text-white flex items-center gap-0.5 transition-colors">
                        View <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WarrantyExpiringProductsTablesComponent;
