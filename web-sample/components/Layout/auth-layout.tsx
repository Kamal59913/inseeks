"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  secondaryLinkCard?: React.ReactNode;
  maxWidth?: string;
  /** Optional back button rendered at the top of the card — passed as a node for full flexibility. */
  backButton?: React.ReactNode;
}

export function AuthLayout({ children, title, description, secondaryLinkCard, maxWidth = "max-w-sm", backButton }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`w-full ${maxWidth}`}>
        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-sm px-10 py-8 mb-3">
          {/* Back button — only shown when provided */}
          {backButton && (
            <div className="mb-4">{backButton}</div>
          )}

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.svg" className="w-20" alt="Logo" />
          </div>

          {title && (
            <div className="text-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-600 mb-1">{title}</h3>
              {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
          )}

          {children}
        </div>

        {/* Secondary Card (Links) */}
        {secondaryLinkCard && (
          <div className="bg-white border border-gray-100 rounded-sm px-10 py-5 text-center mb-3">
            {secondaryLinkCard}
          </div>
        )}

        {/* Get the App */}
        <div className="mt-4">
          {/* <p className="text-center text-sm mb-4">Get the app.</p> */}
          <div className="gap-2 flex justify-center">
            <a href="#">
              <img src="/app-store.png" alt="App Store" className="h-10" />
            </a>
            <a href="#">
              <img src="/google-play.png" alt="Google Play" className="h-10" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 mb-8">
          <div className="text-center text-xs text-gray-500">
            <span>© 2026 AvowSocial</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
