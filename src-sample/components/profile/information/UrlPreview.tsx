import React from "react";

interface UrlPreviewProps {
  urlPath: string;
  baseUrl?: string;
  className?: string;
  isBaseUrl?: boolean;
}

const UrlPreview: React.FC<UrlPreviewProps> = ({
  urlPath,
  baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "emperabeauty.com",
  className = "",
  isBaseUrl = true,
}) => {
  return (
    <div
      className={`flex-1 h-10 bg-[#FFFFFF0D] border border-white/5 rounded-lg px-4 py-2 flex items-center overflow-x-auto min-w-0 ${className}`}
    >
      {isBaseUrl && (
        <span className="text-gray-500 text-sm whitespace-nowrap">
          {baseUrl}/
        </span>
      )}
      <span className="text-white text-sm whitespace-nowrap">{urlPath}</span>
    </div>
  );
};

export default UrlPreview;

