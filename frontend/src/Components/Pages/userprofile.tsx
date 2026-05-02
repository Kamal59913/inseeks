import React, { useState } from "react";
import LeftBar from "../Utilities/LeftBar";
import SearchBar from "../Utilities/SearchBar";
import Post from "../PostComponents/post";
import PostImage from "../PostComponents/postImages";
import Videos from "../PostComponents/postvideo";
import { Link, useParams } from "react-router-dom";
import { useProfileQuery } from "../../hooks/useProfileQuery";
import { useUserPostsQuery } from "../../hooks/usePostsQuery";
import PageLoader from "../Common/PageLoader";
import ImageWithFallback from "../Common/ImageWithFallback";
import ConnectionButton from "../Common/ConnectionButton";
import InfiniteLoader from "../Common/InfiniteLoader";
import { APP_CONFIG } from "../../config/app.config";

const FILTERS = [
  { key: "explore", label: "All Posts" },
  { key: "images", label: "Photos" },
  { key: "videos", label: "Videos" },
  { key: "blogs", label: "Blogs" },
];

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const fallback =
    "https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png";
  const [activeFilter, setActiveFilter] = useState<"explore" | "images" | "videos" | "blogs">("explore");

  const { data: profileuser, isLoading: isProfileLoading } = useProfileQuery(username || "");
  const {
    data: posts,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useUserPostsQuery(username || "", activeFilter, !!username);
  const isProfilePageLoading = isProfileLoading || isPostsLoading;

  const totalPosts =
    (profileuser?.PostsCount || 0) +
    (profileuser?.ImagePostCount || 0) +
    (profileuser?.VideoPostsCount || 0);

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
                <div className="h-32 bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-[#111827] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent"></div>
                </div>

                <div className="px-6 pb-6 -mt-12 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex items-end gap-4">
                      <ImageWithFallback
                        variant="avatar"
                        src={profileuser?.avatar || fallback}
                        alt={profileuser?.fullname}
                        className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#090e1a] bg-[#1a2540]"
                      />
                      <div className="pb-1">
                        <h1 className="text-xl font-bold text-white">
                          {profileuser?.fullname || username}
                        </h1>
                        <p className="text-sm text-slate-400">@{profileuser?.username || username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-1">
                      {profileuser?._id ? (
                        <ConnectionButton
                          userId={profileuser._id}
                          initialIsFollowing={!!profileuser?.isFollowed}
                          className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200"
                          connectedClassName="bg-[#1a2540] text-slate-300 hover:text-red-400"
                          disconnectedClassName="bg-indigo-600 hover:bg-indigo-500 text-white"
                          connectedLabel={
                            <>
                              <i className="fa-solid fa-check text-xs"></i> Connected
                            </>
                          }
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-5">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{totalPosts}</p>
                      <p className="text-xs text-slate-400">Posts</p>
                    </div>
                    <div className="w-px h-8 bg-[#1f2e47]"></div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{profileuser?.followersCount || 0}</p>
                      <p className="text-xs text-slate-400">Followers</p>
                    </div>
                    <div className="w-px h-8 bg-[#1f2e47]"></div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">
                        {profileuser?.channelsFollowedToCount || 0}
                      </p>
                      <p className="text-xs text-slate-400">Following</p>
                    </div>
                    {profileuser?.about && (
                      <>
                        <div className="w-px h-8 bg-[#1f2e47]"></div>
                        <p className="text-sm text-slate-300 line-clamp-2 flex-1">{profileuser.about}</p>
                      </>
                    )}
                  </div>

                  {profileuser?.followerslist?.length > 0 && (
                    <div className="mt-4">
                      <Link
                        to="/home/follow"
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-2 block"
                      >
                        Connections ({profileuser.followersCount || 0}) →
                      </Link>
                      <div className="flex gap-2 flex-wrap">
                        {profileuser.followerslist.slice(0, 8).map((user: any, i: number) => (
                          <ImageWithFallback
                            variant="avatar"
                            key={i}
                            src={user?.avatar || fallback}
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
                  <div className={APP_CONFIG.USE_TWO_COLUMN_FEED ? "columns-1 lg:columns-2 gap-4" : "space-y-4"}>
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
                      avatar: author.avatar || fallback,
                      time: post.createdAt,
                      views: post.views,
                    };
                    
                    let PostComponent = null;
                    if (post.type === "image") PostComponent = <PostImage {...common} title={post.title} images={post.images} />;
                    else if (post.type === "video") PostComponent = <Videos {...common} description={post.description} video={post.video} />;
                    else if (post.type === "blogpost") PostComponent = <Post {...common} title={post.title} description={post.description} image={post.image} attachments={post.attachments} />;
                    
                    if (!PostComponent) return null;
                    
                    return APP_CONFIG.USE_TWO_COLUMN_FEED ? (
                      <div key={post._id} className="break-inside-avoid mb-4">
                        {PostComponent}
                      </div>
                    ) : (
                      PostComponent
                    );
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
