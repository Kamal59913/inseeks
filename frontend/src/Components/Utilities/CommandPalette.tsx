import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { SearchScope } from "../../types/search";
import ImageWithFallback from "../Common/ImageWithFallback";
import { useClickOutside } from "../../hooks/useClickOutside";
import InfiniteLoader from "../Common/InfiniteLoader";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  initialScope?: SearchScope;
}

export default function CommandPalette({ isOpen, onClose, initialScope = "all" }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>(initialScope);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, onClose);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }
  }, [query, scope, isOpen]);

  const {
    data: results,
    isLoading: loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchQuery(query, scope, 8);

  const allItems = [
    ...(results?.people || []).map((p: any) => ({ ...p, _type: 'person' })),
    ...(results?.spaces || []).map((s: any) => ({ ...s, _type: 'space' })),
    ...(results?.posts || []).map((p: any) => ({ ...p, _type: 'post' })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
    if (e.key === "ArrowUp") setSelectedIndex(prev => Math.max(prev - 1, 0));
    if (e.key === "Enter" && allItems[selectedIndex]) handleSelect(allItems[selectedIndex]);
  };

  const handleSelect = (item: any) => {
    onClose();
    if (item._type === 'person') navigate(`/user/${item.username}`);
    if (item._type === 'space') navigate(`/env-home-page/${item.name}`);
    // Post navigation can be added here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-[#090e1a]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={containerRef}
        className="w-full max-w-2xl bg-[#111827] border border-[#1f2e47] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Area */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1f2e47]">
          <i className="fa-solid fa-magnifying-glass text-slate-500 text-lg"></i>
          <input
            autoFocus
            type="text"
            placeholder="Search for people, spaces, or posts..."
            className="flex-1 bg-transparent text-white text-lg outline-none placeholder-slate-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#090e1a] rounded-lg border border-[#1f2e47] text-[10px] font-bold text-slate-500">
            <span className="text-xs">ESC</span>
          </div>
        </div>

        {/* Scope Selectors */}
        <div className="flex items-center gap-1 p-2 bg-[#0d1424]">
          {["all", "people", "spaces", "posts"].map((s) => (
            <button
              key={s}
              onClick={() => setScope(s as SearchScope)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                scope === s ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-[#1a2540]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          {!query && (
            <div className="py-12 text-center">
              <i className="fa-solid fa-keyboard text-4xl text-slate-700 mb-3"></i>
              <p className="text-slate-500 text-sm">Start typing to search across Inseeks</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <i className="fa-solid fa-circle-notch fa-spin text-indigo-500 text-2xl"></i>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {results.people.length > 0 && (
                <div>
                  <h3 className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">People</h3>
                  <div className="mt-1 space-y-1">
                    {results.people.map((p: any, i: number) => {
                      const absoluteIndex = i;
                      return (
                        <button
                          key={p._id}
                          onClick={() => handleSelect({ ...p, _type: 'person' })}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            selectedIndex === absoluteIndex ? "bg-indigo-600/10 ring-1 ring-indigo-500/30" : "hover:bg-[#1a2540]"
                          }`}
                        >
                          <ImageWithFallback variant="avatar" src={p.avatar} className="h-10 w-10 rounded-xl" />
                          <div>
                            <p className="text-sm font-bold text-white">{p.fullname}</p>
                            <p className="text-xs text-slate-500">@{p.username}</p>
                          </div>
                          {p.isFollowing && <span className="ml-auto text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">Following</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {results.spaces.length > 0 && (
                <div>
                  <h3 className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Spaces</h3>
                  <div className="mt-1 space-y-1">
                    {results.spaces.map((s: any, i: number) => {
                      const absoluteIndex = (results.people.length) + i;
                      return (
                        <button
                          key={s._id}
                          onClick={() => handleSelect({ ...s, _type: 'space' })}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            selectedIndex === absoluteIndex ? "bg-indigo-600/10 ring-1 ring-indigo-500/30" : "hover:bg-[#1a2540]"
                          }`}
                        >
                          <ImageWithFallback variant="avatar" src={s.envAvatar} className="h-10 w-10 rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{s.name}</p>
                            <p className="text-xs text-slate-500 truncate">{s.description}</p>
                          </div>
                          {s.isJoined && <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Joined</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {allItems.length === 0 && query && !loading && (
                <div className="py-12 text-center text-slate-500">
                  No results found for "{query}"
                </div>
              )}

              <InfiniteLoader
                onLoadMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoading={isFetchingNextPage}
                label="Loading more results..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#0d1424] border-t border-[#1f2e47] flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
            <kbd className="bg-[#1a2540] px-1 rounded border border-[#1f2e47]">↵</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
            <kbd className="bg-[#1a2540] px-1 rounded border border-[#1f2e47]">↑↓</kbd>
            <span>to navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
