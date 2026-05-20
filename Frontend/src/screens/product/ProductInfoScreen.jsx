import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Hash, Cpu, Calendar, Clock, User, Shield, Info, ArrowLeft } from "lucide-react";
import { SERVER_URL } from "../../router";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";

function ProductInfoScreen() {
  const params = useParams();

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductInfo();
  }, [params.id]);

  const getProductInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, status } = await axios.get(
        `${SERVER_URL}/api/v1/products/${params.id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (status === 200) {
        setProduct(data);
      } else {
        throw new Error(data.error || "Failed to load product details.");
      }
    } catch (error) {
      setError("Error while fetching product information");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Back button */}
      <Link to="/products" className="btn-ghost inline-flex items-center gap-2 text-xs">
        <ArrowLeft size={14} /> Back to products
      </Link>

      {isLoading && <LoadingIndicator />}

      <AnimatePresence>
        {isError && (
          <ShowErrorMessage
            message={isError}
            children={
              <span className="underline cursor-pointer hover:text-red-300 transition-colors" onClick={getProductInfo}>
                Retry
              </span>
            }
          />
        )}
      </AnimatePresence>

      {!isLoading && product && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          {/* Header section with brand colors */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between"
               style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.05) 100%)" }}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white"
                   style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                <Package size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{product.title}</h1>
                <p className="text-xs text-white/40 mt-0.5">ID: {product._id}</p>
              </div>
            </div>
            <span className={`badge-purple`}>
              {product.status || "no status"}
            </span>
          </div>

          {/* Details list */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white/60 flex items-center gap-1.5">
                <Info size={14} className="text-brand-400" /> General Specifications
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Description", value: product.description },
                  { label: "Model", value: product.model, icon: Cpu },
                  { label: "Serial Number", value: product.serialNo, icon: Hash },
                  { label: "Manufacturer", value: product.manufacturer, icon: Package }
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex justify-between items-start py-2 border-b border-white/[0.04]">
                    <span className="text-xs text-white/40 flex items-center gap-1.5">
                      {Icon && <Icon size={12} />} {label}
                    </span>
                    <span className="text-xs font-medium text-white/80 text-right max-w-[200px] truncate">{value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white/60 flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-400" /> Purchase & Ownership
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Date of Purchase", value: product.dateOfPurchase ? new Date(product.dateOfPurchase).toLocaleDateString() : "—", icon: Calendar },
                  { label: "Warranty Months", value: product.warrantyMonths ? `${product.warrantyMonths} months` : "—", icon: Clock },
                  { label: "Assigned User", value: product.user || "—", icon: User },
                  { label: "Created By", value: product.createdBy?.name || "—", icon: Shield }
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                    <span className="text-xs text-white/40 flex items-center gap-1.5">
                      {Icon && <Icon size={12} />} {label}
                    </span>
                    <span className="text-xs font-medium text-white/80">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ProductInfoScreen;
