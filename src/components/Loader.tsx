// components/Loader.jsx
import React from "react";

const Loader = ({ message = "Loading...", size = "h-96", color = "blue-500" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${size} space-y-6`}>
      {/* Animated bouncing dots */}
      <div className="flex space-x-2">
        <span className={`w-4 h-4 bg-${color} rounded-full animate-bounce delay-75`}></span>
        <span className={`w-4 h-4 bg-${color} rounded-full animate-bounce delay-150`}></span>
        <span className={`w-4 h-4 bg-${color} rounded-full animate-bounce delay-300`}></span>
      </div>

      {/* Loading text */}
      <p className="text-gray-700 text-lg sm:text-xl font-semibold tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;
