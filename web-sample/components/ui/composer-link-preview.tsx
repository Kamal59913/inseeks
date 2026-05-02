"use client";

import React from "react";
import { Globe, ExternalLink } from "lucide-react";
import { getLinkifiedSegments } from "@/lib/utilities/linkifyText";
import { COMPOSER_CONFIG } from "@/lib/config/config";

interface ComposerLinkPreviewProps {
  text?: string;
}

const getPreviewData = (text: string) => {
  const firstLink = getLinkifiedSegments(text).find(
    (segment) => segment.type === "link",
  );

  if (!firstLink || firstLink.type !== "link") {
    return null;
  }

  try {
    const url = new URL(firstLink.href);
    const host = url.hostname.replace(/^www\./i, "");
    const path = `${url.pathname}${url.search}` || "/";

    return {
      href: url.toString(),
      label: firstLink.value,
      host,
      path: path === "/" ? "" : path,
    };
  } catch {
    return {
      href: firstLink.href,
      label: firstLink.value,
      host: firstLink.value,
      path: "",
    };
  }
};

export const ComposerLinkPreview = ({
  text = "",
}: ComposerLinkPreviewProps) => {
  if (!COMPOSER_CONFIG.SHOW_LINK_PREVIEW) {
    return null;
  }

  const preview = React.useMemo(() => getPreviewData(text), [text]);

  if (!preview) {
    return null;
  }

  return (
    <a
      href={preview.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group block rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/70"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Globe className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            <span>{preview.host}</span>
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2">
            {preview.label}
          </p>
          {preview.path && (
            <p className="mt-1 truncate text-sm text-blue-500">
              {preview.path}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};
