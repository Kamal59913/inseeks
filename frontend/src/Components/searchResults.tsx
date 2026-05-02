import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import LeftBar from "./Utilities/LeftBar";
import SearchBar from "./Utilities/SearchBar";
import PageLoader from "./Common/PageLoader";
import ImageWithFallback from "./Common/ImageWithFallback";
import { useSearchQuery } from "../hooks/useSearchQuery";
import {
  SearchPost,
  SearchScope,
  SearchPerson,
  SearchSpace,
} from "../types/search";
import { SEARCH_SCOPE_OPTIONS, getSearchResultHref } from "../utils/search";
import InfiniteLoader from "./Common/InfiniteLoader";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const scope = (searchParams.get("scope") as SearchScope) || "all";
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchQuery(query, scope, 12);
  const people = data?.people || [];
  const spaces = data?.spaces || [];
  const posts = data?.posts || [];
  const isSearching = isLoading || (!!query && !data && isFetching);

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar />

        <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-8">
          <div className="rounded-xl border border-[#1f2e47] bg-[#111827] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">
              Search
            </p>
            <h1 className="mt-3 text-2xl font-bold text-white">
              {query ? `Results for "${query}"` : "Search Inseeks"}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {SEARCH_SCOPE_OPTIONS.map((option) => (
                <span
                  key={option.key}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    option.key === scope
                      ? "bg-indigo-600 text-white"
                      : "bg-[#0d1424] text-slate-400"
                  }`}
                >
                  {option.label}
                </span>
              ))}
            </div>
          </div>

          {isSearching ? (
            <PageLoader />
          ) : !query ? (
            <div className="rounded-xl border border-[#1f2e47] bg-[#0d1424] px-6 py-16 text-center text-slate-500">
              Enter a search term in the header to explore people, spaces, and
              posts.
            </div>
          ) : (
            <>
              {people.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                      <i className="fa-solid fa-user-group text-indigo-400 text-sm"></i>
                      People
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {people.map((person: SearchPerson) => (
                      <Link
                        key={person._id}
                        to={getSearchResultHref(person, "people")}
                        className="flex items-center gap-3 bg-[#111827] rounded-xl p-4 transition-all group hover:bg-[#131d31]"
                      >
                        <ImageWithFallback
                          variant="avatar"
                          src={person.avatar}
                          alt={person.fullname || person.username}
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-[#2a3d5c] group-hover:ring-indigo-500 transition-all shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-200 truncate">
                            {person.fullname || person.username}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            @{person.username}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {spaces.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                      <i className="fa-solid fa-seedling text-indigo-400 text-sm"></i>
                      Spaces
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {spaces.map((space: SearchSpace) => (
                      <Link
                        key={space._id}
                        to={getSearchResultHref(space, "spaces")}
                        className="flex items-center gap-3 bg-[#111827] rounded-xl p-4 transition-all group hover:bg-[#131d31]"
                      >
                        <ImageWithFallback
                          variant="avatar"
                          src={space.envAvatar}
                          alt={space.name}
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-[#2a3d5c] group-hover:ring-indigo-500 transition-all shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-200 truncate">
                            {space.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {space.description || "Explore this space"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {posts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                      <i className="fa-solid fa-newspaper text-indigo-400 text-sm"></i>
                      Posts
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {posts.map((post: SearchPost) => (
                      <Link
                        key={post._id}
                        to={getSearchResultHref(post, "posts")}
                        className="block rounded-xl bg-[#111827] p-4 transition-all hover:bg-[#131d31]"
                      >
                        <p className="text-sm font-semibold text-slate-200">
                          {post.title || post.description || "Open post"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {post.author?.fullname ||
                            post.author?.username ||
                            "Unknown author"}
                        </p>
                        {post.description && post.title ? (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                            {post.description}
                          </p>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <InfiniteLoader
                onLoadMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoading={isFetchingNextPage}
                label="Loading more results..."
              />

              {people.length === 0 &&
                spaces.length === 0 &&
                posts.length === 0 && (
                  <div className="rounded-xl border border-[#1f2e47] bg-[#0d1424] px-6 py-16 text-center text-slate-500">
                    No results found for "{query}".
                  </div>
                )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
