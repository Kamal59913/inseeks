import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  trigger: React.ReactNode;
}

export default function ContextMenu({ items, trigger }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        left: rect.right - 192, // 192px = w-48
      });
    }
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleToggle} className="inline-flex">
        {trigger}
      </div>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[99999] w-48 rounded-xl border border-[#1f2e47] bg-[#0f1729] shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden animate-fade-in"
            style={{ top: position.top, left: position.left }}
          >
            <div className="py-1.5">
              {items.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={item.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick();
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                    item.variant === 'danger'
                      ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                      : 'text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-300'
                  } ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {item.icon && <i className={`fa-solid ${item.icon} text-xs w-4 text-center`}></i>}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
