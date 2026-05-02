"use client";

import React from "react";

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          {/* Subtle outer breathing glow */}
          <div className="absolute h-32 w-32 animate-pulse rounded-full bg-primary/5 blur-2xl" />
          
          {/* Primary outer ring */}
          <div 
            className="absolute h-24 w-24 rounded-full border-2 border-primary/20 border-t-primary/80 border-l-primary/40" 
            style={{ 
              animation: 'spin 3s linear infinite'
            }} 
          />
          
          {/* Secondary counter-rotating ring */}
          <div 
            className="absolute h-20 w-20 rounded-full border border-primary/10 border-r-primary/60 border-b-primary/30" 
            style={{ 
              animation: 'spin 1.5s linear infinite reverse'
            }} 
          />
          
          {/* Central logo with pulse */}
          <div 
            className="relative z-10"
            style={{
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <img 
              src="/logo_avow_social.svg" 
              alt="Avow Social" 
              className="h-14 w-14 drop-shadow-xl select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
