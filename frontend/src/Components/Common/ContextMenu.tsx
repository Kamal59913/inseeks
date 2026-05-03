import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
  align?: 'start' | 'center' | 'end';
}

export default function ContextMenu({ items, trigger, align = 'end' }: ContextMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {items.map((item, i) => (
          <DropdownMenuItem
            key={i}
            disabled={item.disabled}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
            className={
              item.variant === 'danger'
                ? 'text-red-400 focus:text-red-300 focus:bg-red-500/10'
                : 'text-slate-300 focus:text-indigo-300 focus:bg-indigo-500/10'
            }
          >
            {item.icon && <i className={`fa-solid ${item.icon} text-xs w-4 text-center`}></i>}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
