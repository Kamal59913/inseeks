"use client";

import React from "react";

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md">
      <div className="relative flex items-center justify-center">

        {/* Outer slow ripple */}
        <span
          className="absolute rounded-full bg-pink-300/20"
          style={{
            width: 120,
            height: 120,
            animation: "beat-ripple 4s ease-out infinite",
          }}
        />

        {/* Mid ripple — offset phase */}
        <span
          className="absolute rounded-full bg-pink-400/25"
          style={{
            width: 90,
            height: 90,
            animation: "beat-ripple 4s ease-out 0.18s infinite",
          }}
        />

        {/* Inner glow ring */}
        <span
          className="absolute rounded-full"
          style={{
            width: 68,
            height: 68,
            background:
              "radial-gradient(circle, rgba(244,114,182,0.18) 0%, rgba(236,72,153,0.10) 100%)",
            animation: "beat-scale 4s cubic-bezier(0.34,1.56,0.64,1) infinite",
          }}
        />

        {/* Logo */}
        <img
          src="/logo_avow_social.svg"
          alt="Avow Social"
          draggable={false}
          className="relative z-10 h-12 w-12 select-none drop-shadow-lg"
          style={{
            animation: "beat-scale 4s cubic-bezier(0.34,1.56,0.64,1) infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes beat-scale {
          0%   { transform: scale(1); }
          14%  { transform: scale(1.18); }
          28%  { transform: scale(1); }
          42%  { transform: scale(1.10); }
          70%  { transform: scale(1); }
          100% { transform: scale(1); }
        }

        @keyframes beat-ripple {
          0%   { transform: scale(0.85); opacity: 0.7; }
          14%  { transform: scale(1.15); opacity: 0.5; }
          50%  { transform: scale(1.35); opacity: 0.15; }
          100% { transform: scale(1.55); opacity: 0; }
        }
      `}</style>
    </div>
  );
};