import React from "react";

const OverlayLoader = ({ message = "Processing...", color = "blue-500" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-white/30 shadow-xl border border-white/40">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div
            className={`absolute inset-0 rounded-full border-4 border-t-transparent border-${color} animate-spin`}
          ></div>
        </div>

        {/* Message */}
        <p className="text-gray-800 text-lg font-semibold animate-pulse tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};

export default OverlayLoader;
