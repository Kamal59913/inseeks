import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  InfiniteLoader,
  GlobalLoader,
} from "@repo/ui/index";
import { ImageOff, Users } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetFollowedCommunities } from "@/hooks/communityServices/useGetFollowedCommunities";
import { useGetFollowedCommunityPosts } from "@/hooks/communityServices/useGetFollowedCommunityPosts";
import { useGetCommunities } from "@/hooks/communityServices/useGetCommunities";
import { PostCard } from "../../Features/PostCard";
import { CommunityCard } from "../../Features/CommunityCard";
import { useSearchCommunities } from "@/hooks/communityServices/useSearchCommunities";
import { CommunitySearch } from "../../Features/CommunitySearch";
import { useScrollAnchor } from "@/hooks/useScrollAnchor";
import { useEntityScrollAnchor } from "@/hooks/useEntityScrollAnchor";

interface CommunitiesTabProps {
  isMinimal?: boolean;
  activeSubTab?: string;
}

const CommunitiesTab = ({
  isMinimal = false,
  activeSubTab = "All",
}: CommunitiesTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { startTracking, restore } = useScrollAnchor(`feed-community-${activeSubTab}`);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const routeStateKey = `${pathname}?${searchParams.toString()}`;
  const {
    startTracking: startCommunityTracking,
    restore: restoreCommunityPosition,
  } = useEntityScrollAnchor({
    key: `community-list:${routeStateKey}`,
    dataAttribute: "data-community-id",
    clickedStorageKey: "avom-clicked-community",
    intentStorageKey: "avom-community-scroll-intent",
    elementIdPrefix: "community-",
  });

  const filterTabs = [
    { name: "All", href: isMinimal ? "/home/communities" : "/communities" },
    {
      name: "You Subscribed",
      href: isMinimal
        ? "/home/communities/subscribed"
        : "/communities?filter=subscribed",
    },
    {
      name: "Liked",
      href: isMinimal ? "/home/communities/liked" : "/communities?filter=liked",
    },
    {
      name: "Saved",
      href: isMinimal ? "/home/communities/saved" : "/communities?filter=saved",
    },
  ];

  const getFilterValue = (tab: string) => {
    switch (tab) {
      case "You Subscribed":
        return "subscribed";
      case "Liked":
        return "liked";
      case "Saved":
        return "saved";
      case "All":
      default:
        return "all";
    }
  };

  // URL state management
  const view = isMinimal ? "home" : searchParams.get("view") || "home";
  const filter = searchParams.get("filter") || "all";

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Authentication & Data Fetching
  const { userData } = useAuthStore();

  // 1. Fetch Followed Communities
  const { data: followedCommunitiesData, isLoading: isCommunitiesLoading } =
    useGetFollowedCommunities({ enabled: !!userData?.id });

  const followedCommunities = followedCommunitiesData?.data || [];

  // 2. Fetch Posts for all followed communities
  const {
    data: communityPostsData,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts
  } = useGetFollowedCommunityPosts(20, 6, getFilterValue(activeSubTab), {
    enabled: !!userData?.id,
  });

  const communityPosts = communityPostsData?.pages?.flatMap(page => page.posts) || [];
  console.log("hi these are the community posts related", communityPosts);

  useEffect(() => {
    if (communityPosts.length > 0) startTracking(listRef);
  }, [communityPosts, startTracking]);

  useEffect(() => {
    if (communityPosts.length > 0) restore();
  }, [communityPosts.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Search Data
  const {
    data: searchResultsData,
    isFetching: isSearchFetching,
    isLoading: isSearchLoading,
  } = useSearchCommunities(searchQuery);

  const searchResults = (searchResultsData?.data || []).map((c: any) => ({
    ...c,
    image: c.profile_photo_url,
    members: c.subscriber_count || 0,
    memberAvatars: c.follower_avatars || [],
  }));

  // 4. Fetch All Communities for Explore
  const {
    data: allCommunitiesData,
    isLoading: isExploreLoading,
    fetchNextPage: fetchNextExplore,
    hasNextPage: hasNextExplore,
    isFetchingNextPage: isFetchingNextExplore
  } = useGetCommunities();

  const exploreCommunities = (allCommunitiesData?.pages?.flatMap(page => page.communities) || []).map((c: any) => ({
    ...c,
    // Map API fields to UI props if different
    image: c.profile_photo_url, // Fallback image
    members: c.subscriber_count || 0,
    memberAvatars: c.follower_avatars || [],
  }));

  const communitiesToDisplay = searchQuery ? searchResults : exploreCommunities;
  const isDataLoading = searchQuery ? isSearchLoading : isExploreLoading;

  useEffect(() => {
    startCommunityTracking(contentRef);
  }, [
    startCommunityTracking,
    searchResults.length,
    exploreCommunities.length,
    followedCommunities.length,
    view,
    filter,
    searchQuery,
    activeSubTab,
  ]);

  useEffect(() => {
    if (contentRef.current?.querySelector("[data-community-id]")) {
      restoreCommunityPosition();
    }
  }, [
    restoreCommunityPosition,
    searchResults.length,
    exploreCommunities.length,
    followedCommunities.length,
    view,
    filter,
    searchQuery,
    activeSubTab,
  ]);

  return (
    <div ref={contentRef}>
      {isMinimal && (
        <div className="flex space-x-2 justify-center">
          {filterTabs.map((tab) => (
            <Link key={tab.name} href={tab.href}>
              <Button
                variant={
                  activeSubTab === tab.name ||
                    (activeSubTab === "All" && tab.name === "All")
                    ? "default"
                    : "outline"
                }
                className={`rounded-full text-xs h-10 shadow-none px-5 ${activeSubTab === tab.name ||
                    (activeSubTab === "All" && tab.name === "All")
                    ? "bg-primary hover:bg-primary text-white border-primary"
                    : "border-gray-200 text-gray-600 bg-gray-100"
                  }`}
              >
                {tab.name}
              </Button>
            </Link>
          ))}
        </div>
      )}
      <Tabs
        value={view}
        onValueChange={(val) => updateParams({ view: val, filter: null })}
      >
        {!isMinimal && (
          <TabsList className="grid grid-cols-2 w-full mb-6 bg-gray-100 rounded-full h-9">
            <TabsTrigger
              value="home"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary shadow-none"
            >
              Home
            </TabsTrigger>
            <TabsTrigger
              value="explore"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary shadow-none"
            >
              Explore
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="home" className="mt-0">
          {!isMinimal && (
            <>
              <CommunitySearch
                onSearch={setSearchQuery}
                placeholder="Search communities..."
                isLoading={isSearchFetching}
              />
              {searchQuery ? (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Search Results
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {isSearchLoading ? (
                      <GlobalLoader className="col-span-2" />
                    ) : searchResults.length > 0 ? (
                      searchResults.map((community: any) => (
                        <CommunityCard
                          key={community.id}
                          community={community}
                        />
                      ))
                    ) : (
                      <EmptyState title="No communities found." className="col-span-2" />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Communities You Followed
                  </h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {isCommunitiesLoading ? (
                      <GlobalLoader className="col-span-3" />
                    ) : followedCommunities.length > 0 ? (
                      followedCommunities.slice(0, 3).map((community: any) => (
                        <Link
                          href={`/community/${community.id}`}
                          key={community.id}
                          className="block"
                          id={`community-${community.id}`}
                          data-community-id={community.id}
                          onClick={() => {
                            sessionStorage.setItem("avom-community-scroll-intent", "true");
                            sessionStorage.setItem("avom-clicked-community", String(community.id));
                          }}
                        >
                          <div className="relative h-32 rounded-xl overflow-hidden cursor-pointer bg-gray-200">
                            {community.profile_photo_url ? (
                              <Image
                                src={community.profile_photo_url}
                                alt={community.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                                <ImageOff className="w-8 h-8 text-gray-400" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <p className="absolute bottom-2 left-2 text-white text-xs font-medium">
                              {community.name}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm col-span-3">
                        You haven't followed any communities yet.
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <div ref={listRef} className="space-y-6 mt-6">
            {isPostsLoading ? (
              <GlobalLoader />
            ) : communityPosts.length > 0 ? (
              <>
                {communityPosts.map((post: any) => (
                  <PostCard key={post.id} post={post} showTrending={false} />
                ))}
                <div className="py-4">
                  <InfiniteLoader
                    onLoadMore={fetchNextPosts}
                    hasMore={hasNextPosts}
                    isLoading={isFetchingNextPosts}
                  />
                </div>
              </>
            ) : followedCommunities.length === 0 ? (
              <EmptyState
                title="You haven't joined any communities yet."
                description="Follow communities to see their posts here. Explore and find communities that interest you!"
              />
            ) : (
              <EmptyState
                title="No posts in your communities yet."
                description="The communities you've joined haven't posted anything yet. Check back later or explore more communities!"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="explore" className="mt-0">
          <CommunitySearch
            onSearch={setSearchQuery}
            placeholder="Search communities..."
            isLoading={isSearchFetching}
          />
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {searchQuery ? "Search Results" : "Discover New Communities"}
          </h2>
          <Tabs
            value={filter}
            onValueChange={(val) => updateParams({ filter: val })}
          >
            <TabsList className="grid grid-cols-4 w-full mb-6 bg-gray-100 rounded-full">
              <TabsTrigger value="all" className="rounded-full">
                {searchQuery ? "Results" : "For You"}
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="rounded-full"
                disabled={!!searchQuery}
              >
                Popular
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="rounded-full"
                disabled={!!searchQuery}
              >
                News
              </TabsTrigger>
              <TabsTrigger
                value="sports"
                className="rounded-full"
                disabled={!!searchQuery}
              >
                Sports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                {isDataLoading ? (
                  <GlobalLoader className="col-span-2" />
                ) : communitiesToDisplay.length > 0 ? (
                  <>
                    {communitiesToDisplay.map((community: any) => (
                      <CommunityCard key={community.id} community={community} />
                    ))}
                    {!searchQuery && (
                      <div className="col-span-2 py-4">
                        <InfiniteLoader
                          onLoadMore={fetchNextExplore}
                          hasMore={hasNextExplore}
                          isLoading={isFetchingNextExplore}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyState title="No communities found." className="col-span-2" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                {isExploreLoading ? (
                  <GlobalLoader className="col-span-2" />
                ) : exploreCommunities.length > 0 ? (
                  exploreCommunities.map((community: any) => (
                    <CommunityCard key={community.id} community={community} />
                  ))
                ) : (
                  <EmptyState title="No communities found." className="col-span-2" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                {isExploreLoading ? (
                  <GlobalLoader className="col-span-2" />
                ) : exploreCommunities.filter((c: any) =>
                  c.name?.toLowerCase().includes("news"),
                ).length > 0 ? (
                  exploreCommunities
                    .filter((c: any) => c.name?.toLowerCase().includes("news"))
                    .map((community: any) => (
                      <CommunityCard key={community.id} community={community} />
                    ))
                ) : (
                  <EmptyState title="No communities found." className="col-span-2" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="sports" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                {isExploreLoading ? (
                  <GlobalLoader className="col-span-2" />
                ) : exploreCommunities.filter((c: any) =>
                  c.name?.toLowerCase().includes("sports"),
                ).length > 0 ? (
                  exploreCommunities
                    .filter((c: any) =>
                      c.name?.toLowerCase().includes("sports"),
                    )
                    .map((community: any) => (
                      <CommunityCard key={community.id} community={community} />
                    ))
                ) : (
                  <EmptyState title="No communities found." className="col-span-2" />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunitiesTab;
