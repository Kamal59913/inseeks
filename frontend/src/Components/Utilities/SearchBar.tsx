import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { SearchPerson, SearchPost, SearchSpace } from "../../types/search";
import {
  buildSearchResultsPath,
  getSearchPlaceholder,
  getSearchResultHref,
  getSearchScopeForPath,
} from "../../utils/search";
import ImageWithFallback from "../Common/ImageWithFallback";
import UnifiedSearch from "./UnifiedSearch";

type SearchRecommendation =
  | { kind: "people"; item: SearchPerson }
  | { kind: "spaces"; item: SearchSpace }
  | { kind: "posts"; item: SearchPost };

export default function SearchBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const scope = getSearchScopeForPath(location.pathname);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchQuery(debouncedQuery, scope, 5);

  const recommendations = useMemo<SearchRecommendation[]>(() => {
    if (!data) return [];

    if (scope === "people") {
      return data.people.map((item: SearchPerson) => ({ kind: "people", item }));
    }

    if (scope === "spaces") {
      return data.spaces.map((item: SearchSpace) => ({ kind: "spaces", item }));
    }

    if (scope === "posts") {
      return data.posts.map((item: SearchPost) => ({ kind: "posts", item }));
    }

    return [
      ...data.people.map((item: SearchPerson) => ({ kind: "people" as const, item })),
      ...data.spaces.map((item: SearchSpace) => ({ kind: "spaces" as const, item })),
      ...data.posts.map((item: SearchPost) => ({ kind: "posts" as const, item })),
    ];
  }, [data, scope]);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(buildSearchResultsPath(trimmed, scope));
  };

  const renderRecommendation = (
    recommendation: SearchRecommendation,
    index: number,
    isSelected: boolean,
    onSelect: (item: SearchRecommendation) => void,
  ) => {
    if (recommendation.kind === "people") {
      const person = recommendation.item;
      return (
        <button
          key={`${recommendation.kind}-${person._id}-${index}`}
          type="button"
          onClick={() => onSelect(recommendation)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
            isSelected ? "bg-indigo-600/10" : "hover:bg-[#1a2540]"
          }`}
        >
          <ImageWithFallback
            variant="avatar"
            src={person.avatar}
            alt={person.fullname || person.username}
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {person.fullname || person.username}
            </p>
            <p className="truncate text-xs text-slate-500">@{person.username}</p>
          </div>
          <span className="rounded-full bg-[#090e1a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Person
          </span>
        </button>
      );
    }

    if (recommendation.kind === "spaces") {
      const space = recommendation.item;
      return (
        <button
          key={`${recommendation.kind}-${space._id}-${index}`}
          type="button"
          onClick={() => onSelect(recommendation)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
            isSelected ? "bg-indigo-600/10" : "hover:bg-[#1a2540]"
          }`}
        >
          <ImageWithFallback
            variant="avatar"
            src={space.envAvatar}
            alt={space.name}
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{space.name}</p>
            <p className="truncate text-xs text-slate-500">
              {space.description || "Explore this space"}
            </p>
          </div>
          <span className="rounded-full bg-[#090e1a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Space
          </span>
        </button>
      );
    }

    const post = recommendation.item;
    return (
      <button
        key={`${recommendation.kind}-${post._id}-${index}`}
        type="button"
        onClick={() => onSelect(recommendation)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
          isSelected ? "bg-indigo-600/10" : "hover:bg-[#1a2540]"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a2540] text-indigo-300">
          <i className="fa-regular fa-file-lines text-sm"></i>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {post.title || post.description || "Open post"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {post.author?.fullname || post.author?.username || "Post"}
          </p>
        </div>
        <span className="rounded-full bg-[#090e1a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Post
        </span>
      </button>
    );
  };

  return (
    <div className="w-full px-6 py-4 bg-[#090e1a]/50 backdrop-blur-md sticky top-0 z-40 border-b border-[#1f2e47]">
      <div className="max-w-4xl mx-auto">
        <UnifiedSearch
          value={searchValue}
          onValueChange={setSearchValue}
          onInputChange={setDebouncedQuery}
          onSearch={handleSearch}
          onSelectRecommendation={(recommendation) => {
            navigate(getSearchResultHref(recommendation.item, recommendation.kind));
          }}
          placeholder={getSearchPlaceholder(scope)}
          isRecommendationsLoading={isFetching}
          recommendations={recommendations}
          getRecommendationLabel={(recommendation) => {
            if (recommendation.kind === "people") {
              return recommendation.item.fullname || recommendation.item.username;
            }
            if (recommendation.kind === "spaces") {
              return recommendation.item.name;
            }
            return recommendation.item.title || recommendation.item.description || "";
          }}
          renderRecommendation={renderRecommendation}
          emptyMessage="No matches found"
          variant="header"
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
