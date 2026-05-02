import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LeftBar from "../Utilities/LeftBar";
import SearchBar from "../Utilities/SearchBar";
import {
  useFollowedUsersQuery,
  useUnfollowedUsersQuery,
} from "../../hooks/useNetworkQueries";
import PageLoader from "../Common/PageLoader";
import ImageWithFallback from "../Common/ImageWithFallback";
import ConnectionButton from "../Common/ConnectionButton";
import UnifiedSearch from "../Utilities/UnifiedSearch";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { SearchPerson } from "../../types/search";
import InfiniteLoader from "../Common/InfiniteLoader";

type NetworkTab = "discover" | "connected";

type NetworkUser = {
  _id: string;
  username: string;
  fullname?: string;
  avatar?: string;
  about?: string;
  isFollowing?: boolean;
};

interface UserCardProps {
  user: NetworkUser;
  fallbackAvatar: string;
  mode: NetworkTab;
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl bg-[#0d1424] px-6 py-20 text-center text-slate-500">
      <i className={`${icon} mb-4 text-5xl text-slate-600`}></i>
      <p className="text-base font-medium text-slate-300">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}

function UserCard({ user, fallbackAvatar, mode }: UserCardProps) {
  const isConnected = mode === "connected";

  return (
    <div className="rounded-3xl bg-[#111827] p-5 transition-all duration-200 hover:border-indigo-500/30 hover:bg-[#131d31]">
      <div className="flex items-start gap-4">
        <Link to={`/user/${user.username}`} className="shrink-0">
          <ImageWithFallback
            variant="avatar"
            src={user.avatar || fallbackAvatar}
            alt={user.username}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#2a3d5c]"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/user/${user.username}`}
                className="block truncate text-sm font-bold text-slate-100 hover:text-indigo-300"
              >
                {user.fullname || user.username}
              </Link>
              <p className="mt-1 truncate text-xs text-slate-500">
                @{user.username}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                isConnected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-700 bg-slate-800 text-slate-400"
              }`}
            >
              {isConnected ? "Connected" : "Discover"}
            </span>
          </div>

          <p className="mt-3 min-h-[40px] text-sm leading-5 text-slate-400">
            {user.about?.trim() || "No bio added yet."}
          </p>

          <div className="mt-4">
            <ConnectionButton
              userId={user._id}
              initialIsFollowing={!!user.isFollowing}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
              connectedClassName="bg-[#1a2540] text-slate-300 hover:text-red-400"
              disconnectedClassName="bg-indigo-600 hover:bg-indigo-500 text-white"
              connectedLabel={isConnected ? "Disconnect" : "Connected"}
              disconnectedLabel="Connect"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyFriends() {
  const [activeTab, setActiveTab] = useState<NetworkTab>("discover");
  const [search, setSearch] = useState("");
  const [recommendationQuery, setRecommendationQuery] = useState("");
  const fallbackAvatar =
    "https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png";
  const {
    data: discoverData,
    isLoading: isDiscoverLoading,
    fetchNextPage: fetchNextDiscoverPage,
    hasNextPage: hasNextDiscoverPage,
    isFetchingNextPage: isFetchingNextDiscoverPage,
  } =
    useUnfollowedUsersQuery();
  const {
    data: connectedData,
    isLoading: isConnectedLoading,
    fetchNextPage: fetchNextConnectedPage,
    hasNextPage: hasNextConnectedPage,
    isFetchingNextPage: isFetchingNextConnectedPage,
  } =
    useFollowedUsersQuery();
  const {
    data: suggestionResults,
    isFetching: isSuggestionsLoading,
    fetchNextPage: fetchNextSuggestionPage,
    hasNextPage: hasNextSuggestionPage,
    isFetchingNextPage: isFetchingNextSuggestionPage,
  } =
    useSearchQuery(recommendationQuery, "people", 6);
  const isNetworkLoading = isDiscoverLoading || isConnectedLoading;

  const recommendations = suggestionResults?.people || [];

  const discover = useMemo(
    () =>
      ((discoverData?.items || []) as NetworkUser[]).filter(
        (user) => !user.isFollowing,
      ),
    [discoverData],
  );

  const connected = useMemo(
    () =>
      ((connectedData?.items || []) as NetworkUser[]).filter(
        (user) => !!user.isFollowing,
      ),
    [connectedData],
  );

  const filteredUsers = useMemo(() => {
    const list = activeTab === "discover" ? discover : connected;
    if (!search.trim()) return list;
    const lower = search.toLowerCase();
    return list.filter(
      (u) =>
        u.username?.toLowerCase().includes(lower) ||
        u.fullname?.toLowerCase().includes(lower) ||
        u.about?.toLowerCase().includes(lower),
    );
  }, [activeTab, discover, connected, search]);

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar />

        <div className="mx-auto w-full max-w-5xl px-4 py-6">
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#10192b] via-[#0d1424] to-[#111827] p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">
                  Network
                </p>
                <h1 className="mt-4 text-3xl font-bold text-white">People</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Discover people and manage your connections
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:min-w-[280px]">
                <div className="rounded-2xl bg-[#0b1220] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Discover
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {discover.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#0b1220] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Connected
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {connected.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-1 rounded-2xl bg-[#111827] p-1">
              <button
                onClick={() => setActiveTab("discover")}
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "discover"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab("connected")}
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "connected"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Connected
                {connected.length > 0 && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                    {connected.length}
                  </span>
                )}
              </button>
            </div>

            <div className="w-full sm:max-w-xs">
              <UnifiedSearch<SearchPerson>
                value={search}
                onValueChange={setSearch}
                onInputChange={setRecommendationQuery}
                onSearch={setSearch}
                placeholder="Search people..."
                isRecommendationsLoading={isSuggestionsLoading}
                recommendations={recommendations}
                getRecommendationLabel={(item) =>
                  item.fullname || item.username
                }
                renderRecommendation={(item, index, isSelected, onSelect) => (
                  <button
                    key={`${item._id}-${index}`}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      isSelected ? "bg-indigo-600/10" : "hover:bg-[#1a2540]"
                    }`}
                  >
                    <ImageWithFallback
                      variant="avatar"
                      src={item.avatar}
                      alt={item.fullname || item.username}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.fullname || item.username}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        @{item.username}
                      </p>
                    </div>
                  </button>
                )}
                emptyMessage="No matching people found"
                hasNextPage={hasNextSuggestionPage}
                fetchNextPage={fetchNextSuggestionPage}
                isFetchingNextPage={isFetchingNextSuggestionPage}
              />
            </div>
          </div>

          {isNetworkLoading ? (
            <PageLoader />
          ) : filteredUsers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  fallbackAvatar={fallbackAvatar}
                  mode={activeTab}
                />
                ))}
              </div>
              {!search.trim() ? (
                <InfiniteLoader
                  onLoadMore={
                    activeTab === "discover"
                      ? fetchNextDiscoverPage
                      : fetchNextConnectedPage
                  }
                  hasMore={
                    activeTab === "discover"
                      ? hasNextDiscoverPage
                      : hasNextConnectedPage
                  }
                  isLoading={
                    activeTab === "discover"
                      ? isFetchingNextDiscoverPage
                      : isFetchingNextConnectedPage
                  }
                  label="Loading more people..."
                />
              ) : null}
            </>
          ) : (
            <div className="animate-in fade-in duration-300">
              <EmptyState
                icon={
                  activeTab === "discover"
                    ? "fa-regular fa-user"
                    : "fa-regular fa-user-group"
                }
                title={
                  search
                    ? "No results found"
                    : activeTab === "discover"
                      ? "No new people to discover"
                      : "No connections yet"
                }
                description={
                  search
                    ? `We couldn't find anyone matching "${search}"`
                    : activeTab === "discover"
                      ? "You're already connected with everyone showing up here."
                      : "Start connecting with people from the discover tab."
                }
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
