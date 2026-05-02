import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import LeftBar from "../Utilities/LeftBar";
import SearchBar from "../Utilities/SearchBar";
import Post from "../PostComponents/post";
import PostImage from "../PostComponents/postImages";
import Videos from "../PostComponents/postvideo";
import SharePost from "../Utilities/sharePost";
import { authService } from "../../services/auth.service";
import { useCurrentUserQuery } from "../../hooks/useCurrentUserQuery";
import { useHomePostsQuery } from "../../hooks/usePostsQuery";
import {
  useSuggestedUsersQuery,
} from "../../hooks/useNetworkQueries";
import { useEnvironmentQuery } from "../../hooks/useEnvironmentQuery";
import { queryKeys } from "../../hooks/queryKeys";
import PageLoader from "../Common/PageLoader";
import ImageWithFallback from "../Common/ImageWithFallback";
import ConnectionButton from "../Common/ConnectionButton";
import SpaceJoinButton from "../Common/SpaceJoinButton";
import InfiniteLoader from "../Common/InfiniteLoader";
import { prependInfiniteItems } from "../../hooks/infiniteQueryUtils";

interface FilterType {
  key: "explore" | "images" | "videos" | "blogs";
  label: string;
  icon: string;
}

const FILTERS: FilterType[] = [
  { key: "explore", label: "All", icon: "fa-border-all" },
  { key: "images", label: "Photos", icon: "fa-image" },
  { key: "videos", label: "Videos", icon: "fa-video" },
  { key: "blogs", label: "Blogs", icon: "fa-newspaper" },
];

export default function Homepage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] =
    useState<FilterType["key"]>("explore");
  const [sidebarTab, setSidebarTab] = useState<"people" | "spaces">("people");
  const [avatar] = useState(
    "https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png",
  );

  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUserQuery();
  const {
    data: posts,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useHomePostsQuery(activeFilter);
  const {
    data: userList,
    isLoading: isUserListLoading,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasNextUsers,
    isFetchingNextPage: isFetchingNextUsers,
  } = useSuggestedUsersQuery(6);
  const {
    data: spaces,
    isLoading: isSpacesLoading,
    fetchNextPage: fetchNextSpaces,
    hasNextPage: hasNextSpaces,
    isFetchingNextPage: isFetchingNextSpaces,
  } = useEnvironmentQuery(7);

  const isHomeLoading =
    isCurrentUserLoading || isPostsLoading || isUserListLoading || isSpacesLoading;

  const logout = () => {
    navigate("/");
    authService.logout().catch(() => {});
  };

  const updatepost = (newposts: any) => {
    queryClient.setQueryData(
      queryKeys.homePosts(activeFilter),
      (previous: any) =>
        prependInfiniteItems(previous, Array.isArray(newposts) ? newposts : [newposts]),
    );
  };

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar logout={logout} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar />

        <div className="max-w-2xl mx-auto w-full py-6 space-y-4">
          <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-xl">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === f.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-[#1a2540]"
                }`}
              >
                <i className={`fa-solid ${f.icon} text-xs`}></i>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
          </div>

          {isHomeLoading ? (
            <PageLoader />
          ) : (
            <>
              <SharePost avatar={currentUser?.avatar || avatar} modalData={{ updatepost }} />

              {(posts?.items || []).length > 0 ? (
                <>
                  <div className="space-y-4">
                    {(posts?.items || []).map((post: any) => {
                    const author = post.author?.[0];
                    if (!author) return null;

                    const common = {
                      key: post._id,
                      postId: post._id,
                      type: post.type,
                      community: post.community,
                      upvotesCount: post.upvotesCount || 0,
                      downvotesCount: post.downvotesCount || 0,
                      userVote: post.userVote || null,
                      score:
                        typeof post.score === "number"
                          ? post.score
                          : (post.upvotesCount || 0) - (post.downvotesCount || 0),
                      conversationCount: post.conversationCount || 0,
                      _id: author._id,
                      author: author.username,
                      avatar: author.avatar || avatar,
                      time: post.createdAt,
                      editTime: post.updatedAt,
                      views: post.views,
                      currentUser,
                    };

                    if (post.type === "image") {
                      return (
                        <PostImage
                          {...common}
                          title={post.title}
                          images={post.images}
                        />
                      );
                    }

                    if (post.type === "video") {
                      return (
                        <Videos
                          {...common}
                          description={post.description}
                          video={post.video}
                        />
                      );
                    }

                    if (post.type === "blogpost") {
                      return (
                        <Post
                          {...common}
                          title={post.title}
                          description={post.description}
                          image={post.image}
                          attachments={post.attachments}
                        />
                      );
                    }

                    return null;
                    })}
                  </div>
                  <InfiniteLoader
                    onLoadMore={fetchNextPosts}
                    hasMore={hasNextPosts}
                    isLoading={isFetchingNextPosts}
                    label="Loading more posts..."
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <i className="fa-regular fa-compass text-5xl mb-4 text-slate-600"></i>
                  <p className="text-base font-medium">No posts yet</p>
                  <p className="text-sm mt-1">Be the first to share something!</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <aside className="hidden xl:flex flex-col shrink-0 w-72 h-screen border-l border-[#1f2e47] bg-[#090e1a] py-6 px-4">
        <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-xl mb-4">
          {[
            { key: "people", label: "People" },
            { key: "spaces", label: "Spaces" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSidebarTab(tab.key as "people" | "spaces")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                sidebarTab === tab.key
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-[#1a2540]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isHomeLoading ? (
            <div className="flex h-full items-center justify-center">
              <PageLoader />
            </div>
          ) : sidebarTab === "people" ? (
            <>
              <div className="space-y-2">
                {(userList?.items || []).map((user: any) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#111827] transition-all group"
                >
                  <ImageWithFallback
                    variant="avatar"
                    src={user.avatar || avatar}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2a3d5c]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.about?.length > 30
                        ? `${user.about.slice(0, 30)}...`
                        : user.about}
                    </p>
                  </div>
                  <ConnectionButton
                    userId={user._id}
                    initialIsFollowing={!!user.isFollowing}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shrink-0"
                    connectedClassName="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                    disconnectedClassName="bg-indigo-600 hover:bg-indigo-500 text-white"
                  />
                </div>
                ))}
              </div>
              <InfiniteLoader
                onLoadMore={fetchNextUsers}
                hasMore={hasNextUsers}
                isLoading={isFetchingNextUsers}
                label="Loading more people..."
              />
            </>
          ) : (
            <>
              <div className="space-y-2">
                {(spaces?.items || []).map((space: any) => (
                <div
                  key={space._id}
                  onClick={() => navigate(`/env-home-page/${space.name}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#111827] transition-all text-left cursor-pointer"
                >
                  <ImageWithFallback
                    src={space.envAvatar || avatar}
                    alt={space.name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {space.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {space.description?.length > 34
                        ? `${space.description.slice(0, 34)}...`
                        : space.description}
                    </p>
                  </div>
                  <SpaceJoinButton
                    title={space.name}
                    initialIsJoined={!!space.isJoined}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 transition-all duration-200"
                    joinedClassName="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    unjoinedClassName="bg-indigo-600 hover:bg-indigo-500 text-white"
                    joinedLabel="Joined"
                    unjoinedLabel="Join"
                  />
                </div>
                ))}
              </div>
              <InfiniteLoader
                onLoadMore={fetchNextSpaces}
                hasMore={hasNextSpaces}
                isLoading={isFetchingNextSpaces}
                label="Loading more spaces..."
              />
            </>
          )}
        </div>

        <Link
          to={sidebarTab === "people" ? "/home/follow" : "/environments"}
          className="mt-4 text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors block"
        >
          {sidebarTab === "people" ? "See all people ->" : "See all spaces ->"}
        </Link>
      </aside>
    </div>
  );
}
