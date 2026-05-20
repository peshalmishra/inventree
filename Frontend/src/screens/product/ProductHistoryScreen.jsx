import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Info, Calendar, ArrowLeft, History, Package } from "lucide-react";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { SERVER_URL } from "../../router";

function ProductHistoryScreen() {
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [productData, setData] = useState(null);
  const [isError, setError] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, []);

  async function getDataFromApi() {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${SERVER_URL}/api/v1/products/${params.id}/history`
      );
      setData(data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch product history details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <Link to="/products" className="btn-ghost inline-flex items-center gap-2 text-xs">
        <ArrowLeft size={14} /> Back to products
      </Link>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History size={22} className="text-brand-400" />
            Product Details & History
          </h1>
          <p className="text-sm text-white/40 mt-1">Audit log and lifecycle tracing</p>
        </div>
      </motion.div>

      {isLoading && <LoadingIndicator />}

      <AnimatePresence>
        {isError && (
          <ShowErrorMessage
            message={isError}
            children={
              <span className="underline cursor-pointer hover:text-red-300 transition-colors" onClick={getDataFromApi}>
                Retry
              </span>
            }
          />
        )}
      </AnimatePresence>

      {!isLoading && productData && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* General specs section */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                <Info size={14} className="text-brand-400" /> Product Specifications
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-dark">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th>Product</th>
                    <th>Serial Number</th>
                    <th>Used By</th>
                    <th>Model</th>
                    <th>Manufacturer</th>
                    <th>Warranty</th>
                    <th>Flags</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white/80">{productData.title}</p>
                        <p className="text-xs text-white/30 mt-0.5 max-w-[250px] truncate">{productData.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-white/60">{productData.serialNo}</td>
                    <td className="px-4 py-3 text-xs text-white/60">{productData.user || "—"}</td>
                    <td className="px-4 py-3 text-xs text-white/60">{productData.model}</td>
                    <td className="px-4 py-3 text-xs text-white/60">{productData.manufacturer?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="badge-purple">{productData.warrantyMonths}mo</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {productData.isPart && <span className="badge-green">Part</span>}
                        {productData.rackMountable && <span className="badge-yellow">Rack</span>}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* History details section */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                <Clock size={14} className="text-brand-400" /> State Transitions Log
              </h2>
            </div>
            {productData.history && productData.history.length > 0 ? (
              <HistoryTable historyInformation={productData.history} />
            ) : (
              <div className="p-8 text-center text-white/30 text-sm">
                No state transitions recorded.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

const HistoryTable = ({ historyInformation }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-dark">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th>Location</th>
            <th>Location Description</th>
            <th>Status</th>
            <th>Change Date</th>
          </tr>
        </thead>
        <tbody>
          {historyInformation.map((history) => (
            <tr key={history._id} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors">
              <td className="px-4 py-3 text-sm font-semibold text-white/80">{history.location?.name || "—"}</td>
              <td className="px-4 py-3 text-xs text-white/40 max-w-[300px] truncate">{history.location?.description || "—"}</td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  {history.status.map((status, index) => (
                    <span key={index} className="inline-block badge-purple text-[10px] mr-1">
                      {status.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="space-y-1 text-xs text-white/40">
                  {history.status.map((status, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Calendar size={11} className="text-white/20" />
                      <span>{new Date(status.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductHistoryScreen;
