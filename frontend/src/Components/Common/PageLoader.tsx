import React from 'react';

export default function PageLoader() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      <span className="text-sm text-slate-400">Loading...</span>
    </div>
  );
}
