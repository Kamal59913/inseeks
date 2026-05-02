import React, { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  text: string;
  position?: | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';};

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
  const positions: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
     // Corner positions
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
  };

  const arrowPositions: Record<string, string> = {
    top: 'top-full left-1/2 -translate-x-1/2',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 rotate-180',
    left: 'left-full top-1/2 -translate-y-1/2 -rotate-90',
    right: 'right-full top-1/2 -translate-y-1/2 rotate-90',

    'top-left': 'top-full left-4',
    'top-right': 'top-full right-4',
    'bottom-left': 'bottom-full left-4',
    'bottom-right': 'bottom-full right-4',
  };

  return (
    <div className="group relative inline-block">
      {children}
      {text && (
        <div
          className={`invisible absolute ${positions[position]} z-10 w-max rounded-md bg-black px-3 py-2 text-xs text-white opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100`}
        >
          {text}
          <div
            className={`absolute h-2 w-2 rotate-45 bg-black ${arrowPositions[position]}`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
