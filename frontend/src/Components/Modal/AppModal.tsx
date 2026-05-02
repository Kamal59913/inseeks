import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface AppModalProps {
  children: ReactNode;
  onClose?: () => void;
  contentClassName?: string;
  showCloseButton?: boolean;
  outsideClick?: boolean;
}

export default function AppModal({
  children,
  onClose,
  contentClassName = "",
  showCloseButton = true,
  outsideClick = true,
}: AppModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (outsideClick) onClose?.();
        }}
      />
      <div
        className={`surface-subtle relative z-10 w-full rounded-xl ${contentClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#17233b] text-slate-400 transition-all hover:bg-[#1d2b46] hover:text-slate-200"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
