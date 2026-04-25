import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function AppModal({
  children,
  onClose,
  contentClassName = "",
  showCloseButton = true,
  outsideClick = true,
}) {
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
        className={`relative z-10 w-full rounded-3xl border border-[#24324b] bg-white shadow-2xl ${contentClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
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
