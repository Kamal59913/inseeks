import React from "react";
import { TEXT_RENDER_CONFIG } from "@/lib/config/config";
import { getLinkifiedSegments } from "@/lib/utilities/linkifyText";

interface LinkifiedTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
  as?: React.ElementType;
}

const DEFAULT_LINK_CLASS =
  "break-all text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700";

export const LinkifiedText = ({
  text,
  className = "",
  linkClassName = "",
  as: Component = "span",
}: LinkifiedTextProps) => {
  if (!TEXT_RENDER_CONFIG.AUTO_LINK_URLS) {
    return <Component className={className}>{text}</Component>;
  }

  const segments = getLinkifiedSegments(text);
  const target = TEXT_RENDER_CONFIG.OPEN_LINKS_IN_NEW_TAB ? "_blank" : undefined;
  const rel = TEXT_RENDER_CONFIG.OPEN_LINKS_IN_NEW_TAB
    ? "noreferrer noopener"
    : undefined;

  return (
    <Component className={className}>
      {segments.map((segment, index) =>
        segment.type === "link" && segment.href ? (
          <a
            key={`${segment.href}-${index}`}
            href={segment.href}
            target={target}
            rel={rel}
            className={`${DEFAULT_LINK_CLASS} ${linkClassName}`.trim()}
            onClick={(event) => event.stopPropagation()}
          >
            {segment.value}
          </a>
        ) : (
          <React.Fragment key={`${segment.value}-${index}`}>
            {segment.value}
          </React.Fragment>
        ),
      )}
    </Component>
  );
};
