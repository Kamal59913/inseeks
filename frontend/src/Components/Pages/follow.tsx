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
    <div className="rounded-3xl border border-[#1f2e47] bg-[#0d1424] px-6 py-20 text-center text-slate-500">
      <i className={`${icon} mb-4 text-5xl text-slate-600`}></i>
      <p className="text-base font-medium text-slate-300">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}

function UserCard({ user, fallbackAvatar, mode }: UserCardProps) {
  const isConnected = mode === "connected";

  return (
    <div className="rounded-3xl border border-[#1f2e47] bg-[#111827] p-5 transition-all duration-200 hover:border-indigo-500/30 hover:bg-[#131d31]">
      <div className="flex items-start gap-4">
        <Link to={`/profile/${user.username}`} className="shrink-0">
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
                to={`/profile/${user.username}`}
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
  const fallbackAvatar =
    "https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png";
  const { data: discoverData } = useUnfollowedUsersQuery();
  const { data: connectedData } = useFollowedUsersQuery();

  const discover = useMemo(
    () =>
      ((discoverData || []) as NetworkUser[]).filter(
        (user) => !user.isFollowing,
      ),
    [discoverData],
  );

  const connected = useMemo(
    () =>
      ((connectedData || []) as NetworkUser[]).filter(
        (user) => !!user.isFollowing,
      ),
    [connectedData],
  );

  const users = activeTab === "discover" ? discover : connected;

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar />

        <div className="mx-auto w-full max-w-5xl px-4 py-6">
          <div className="mb-6 rounded-3xl border border-[#1f2e47] bg-gradient-to-r from-[#10192b] via-[#0d1424] to-[#111827] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300/80">
                  Network
                </p>
                <h1 className="mt-3 text-3xl font-bold text-white">People</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Discover people and manage your connections
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[240px]">
                <div className="rounded-2xl bg-[#0b1220] px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Discover
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {discover.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#0b1220] px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Connected
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {connected.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 rounded-2xl bg-[#111827] p-1">
              <button
                onClick={() => setActiveTab("discover")}
                className={`rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === "discover"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-[#1a2540] hover:text-white"
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab("connected")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === "connected"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-[#1a2540] hover:text-white"
                }`}
              >
                Connected
                {connected.length > 0 ? (
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[11px]">
                    {connected.length}
                  </span>
                ) : null}
              </button>
            </div>

            <p className="text-sm text-slate-500">
              {activeTab === "discover"
                ? "Follow someone to move them into your connected list instantly."
                : "Unfollow someone to move them back into discover instantly."}
            </p>
          </div>

          {!discoverData || !connectedData ? (
            <PageLoader />
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  fallbackAvatar={fallbackAvatar}
                  mode={activeTab}
                />
              ))}
            </div>
          ) : activeTab === "discover" ? (
            <EmptyState
              icon="fa-regular fa-user"
              title="No new people to discover"
              description="You're already connected with everyone showing up here."
            />
          ) : (
            <EmptyState
              icon="fa-regular fa-user-group"
              title="No connections yet"
              description="Start connecting with people from the discover tab."
            />
          )}
        </div>
      </main>
    </div>
  );
}
