import React from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function ShowErrorMessage({ message, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400"
    >
      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">
          {message || "Oops! Something went wrong."}
        </p>
        {children && (
          <div className="mt-1.5 text-xs text-red-400/70">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ShowErrorMessage;
