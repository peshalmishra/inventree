import React from "react";

function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center w-full h-full py-8">
      <div
        className="w-9 h-9 rounded-full animate-spin"
        style={{
          border: "2px solid rgba(139, 92, 246, 0.15)",
          borderTopColor: "#a78bfa",
        }}
      />
    </div>
  );
}

export default LoadingIndicator;
