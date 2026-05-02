import React, { useState } from "react";
import LeftBar from "../Utilities/LeftBar";
import SearchBar from "../Utilities/SearchBar";
import Post from "../PostComponents/post";
import Videos from "../PostComponents/postvideo";
import PostImage from "../PostComponents/postImages";
import { Link } from "react-router-dom";
import { useCurrentUserQuery } from "../../hooks/useCurrentUserQuery";
import { useUserPostsQuery } from "../../hooks/usePostsQuery";
import PageLoader from "../Common/PageLoader";
import ImageWithFallback from "../Common/ImageWithFallback";
import InfiniteLoader from "../Common/InfiniteLoader";

const FILTERS = [
  { key: "explore", label: "All Posts" },
  { key: "images", label: "Photos" },
  { key: "videos", label: "Videos" },
  { key: "blogs", label: "Blogs" },
];

export default function MyProfile() {
  const [avatar] = useState(
    "https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png",
  );
  const [activeFilter, setActiveFilter] = useState<"explore" | "images" | "videos" | "blogs">("explore");

  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUserQuery();
  const {
    data: posts,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useUserPostsQuery(currentUser?.username || "", activeFilter, !!currentUser?.username);
  const isProfilePageLoading = isCurrentUserLoading || isPostsLoading;

  const totalPosts = currentUser
    ? (currentUser.PostsCount || 0) +
      (currentUser.ImagePostCount || 0) +
      (currentUser.VideoPostsCount || 0)
    : 0;

  return (
    <div className="flex h-screen bg-[#090e1a] overflow-hidden">
      <LeftBar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0">
        <SearchBar />

        <div className="max-w-3xl mx-auto w-full px-4 py-6">
          {isProfilePageLoading ? (
            <PageLoader />
          ) : (
            <>
 <div className="bg-[#111827] rounded-2xl overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-[#111827] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent"></div>
                </div>

                <div className="px-6 pb-6 -mt-12 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex items-end gap-4">
                      <ImageWithFallback
                        variant="avatar"
                        src={currentUser?.avatar || avatar}
                        alt={currentUser?.fullname}
                        className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#090e1a] bg-[#1a2540]"
                      />
                      <div className="pb-1">
                        <h1 className="text-xl font-bold text-white">{currentUser?.fullname || "—"}</h1>
                        <p className="text-sm text-slate-400">@{currentUser?.username || "—"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-1">
                      <Link to="/settings">
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all">
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                          Edit Profile
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{totalPosts}</p>
                      <p className="text-xs text-slate-400">Posts</p>
                    </div>
                    <div className="w-px h-8 bg-[#1f2e47]"></div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">
                        {Math.max(0, (currentUser?.followersCount || 1) - 1)}
                      </p>
                      <p className="text-xs text-slate-400">Connections</p>
                    </div>
                    <div className="w-px h-8 bg-[#1f2e47]"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {currentUser?.about || "No bio yet"}
                      </p>
                    </div>
                  </div>

                  {currentUser?.followerslist?.length > 0 && (
                    <div className="mt-4">
                      <Link
                        to="/home/follow"
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-2 block"
                      >
                        Connections ({Math.max(0, (currentUser.followersCount || 1) - 1)}) →
                      </Link>
                      <div className="flex gap-2 flex-wrap">
                        {currentUser.followerslist.slice(0, 8).map((user: any, i: number) => (
                          <ImageWithFallback
                            variant="avatar"
                            key={i}
                            src={user?.avatar || avatar}
                            alt=""
                            className="h-9 w-9 rounded-lg object-cover ring-1 ring-[#2a3d5c]"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

 <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-xl mb-4">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key as any)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === f.key
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-[#1a2540]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

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
                      author: author.username,
                      avatar: author.avatar || avatar,
                      time: post.createdAt,
                      views: post.views,
                      currentUser,
                    };
                    if (post.type === "image") return <PostImage {...common} title={post.title} images={post.images} />;
                    if (post.type === "video") return <Videos {...common} description={post.description} video={post.video} />;
                    if (post.type === "blogpost") {
                      return <Post {...common} title={post.title} description={post.description} image={post.image} attachments={post.attachments} />;
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
                  <i className="fa-regular fa-rectangle-list text-5xl mb-4 text-slate-600"></i>
                  <p className="text-base font-medium">No posts yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
