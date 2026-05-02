import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CommunityCard } from "../../Features/CommunityCard";
import { feeds } from "@/lib/utilities/dummyData";
import { useSearchFeeds } from "@/hooks/feedServices/useSearchFeeds";
import { useFeedSuggestions } from "@/hooks/feedServices/useFeedSuggestions";
import { FeedSearch } from "../../Features/FeedSearch";
import { FeedCard } from "../../Features/FeedCard";
import { useEntityScrollAnchor } from "@/hooks/useEntityScrollAnchor";

interface FeedsTabProps {
    isMinimal?: boolean;
    activeSubTab?: string;
}

const FeedsTab = ({ isMinimal = false, activeSubTab = "All" }: FeedsTabProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const contentRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const routeStateKey = `${pathname}?${searchParams.toString()}`;
    const {
        startTracking: startFeedTracking,
        restore: restoreFeedPosition,
    } = useEntityScrollAnchor({
        key: `feed-list:${routeStateKey}`,
        dataAttribute: "data-feed-id",
        clickedStorageKey: "avom-clicked-feed",
        intentStorageKey: "avom-feed-scroll-intent",
        elementIdPrefix: "feed-",
    });
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
        { name: "All", href: isMinimal ? "/home/feeds" : "/feeds" },
        { name: "You Followed", href: isMinimal ? "/home/feeds/followed" : "/feeds/followed" }
    ];

    const getFilterValue = (tab: string) => {
        switch (tab) {
            case "You Followed": return "followed";
            case "All": default: return "all";
        }
    };

    const view = isMinimal ? "home" : (searchParams.get("view") || "home");
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

    // Live Search Data
    const { 
        data: searchResultsData, 
        isFetching: isSearchFetching,
        isLoading: isSearchLoading 
    } = useSearchFeeds(searchQuery);

    const searchResults = ((searchResultsData as any)?.data || searchResultsData || []).map((f: any) => ({
        ...f,
        members: f.subscriber_count || 0,
        memberAvatars: f.follower_avatars || []
    }));

    // Live Suggestions
    const { 
        data: suggestionsData, 
        isLoading: isSuggestionsLoading,
        fetchNextPage: fetchNextSuggestions,
        hasNextPage: hasNextSuggestions,
        isFetchingNextPage: isFetchingNextSuggestions
    } = useFeedSuggestions(getFilterValue(activeSubTab));

    const suggestions = (suggestionsData?.pages?.flatMap(page => page.feeds) || []).map((f: any) => ({
        ...f,
        name: f.title,
        members: f.subscriber_count || 0,
        memberAvatars: f.follower_avatars || []
    }));

    useEffect(() => {
        startFeedTracking(contentRef);
        startCommunityTracking(contentRef);
    }, [
        startFeedTracking,
        startCommunityTracking,
        searchResults.length,
        suggestions.length,
        feeds.length,
        view,
        filter,
        searchQuery,
        activeSubTab,
    ]);

    useEffect(() => {
        if (contentRef.current?.querySelector("[data-feed-id]")) {
            restoreFeedPosition();
        }
    }, [
        restoreFeedPosition,
        searchResults.length,
        suggestions.length,
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
        feeds.length,
        view,
        filter,
        searchQuery,
        activeSubTab,
    ]);

    return (
        <div ref={contentRef}>
            {isMinimal && (
                <div className="flex space-x-2 mb-6 justify-center">
                    {filterTabs.map((tab) => (
                        <Link key={tab.name} href={tab.href}>
                            <Button
                                variant={activeSubTab === tab.name || (activeSubTab === "All" && tab.name === "All") ? "default" : "outline"}
                                className={`rounded-full text-xs h-10 shadow-none px-5 ${
                                    (activeSubTab === tab.name || (activeSubTab === "All" && tab.name === "All"))
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
            <Tabs value={view} onValueChange={(val) => updateParams({ view: val, filter: null })}>
                <TabsContent value="home" className="mt-0">
                    {!isMinimal && (
                        <FeedSearch
                            onSearch={setSearchQuery}
                            placeholder="Search feeds..."
                            isLoading={isSearchFetching}
                        />
                    )} {searchQuery ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                Search Results
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                {isSearchLoading ? (
                                    <GlobalLoader className="col-span-2" />
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((feed: any) => (
                                        <FeedCard
                                            key={feed.id}
                                            feed={feed}
                                        />
                                    ))
                                ) : (
                                    <EmptyState title="No results found." className="col-span-2" />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                Discover New Feeds
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                {isSuggestionsLoading ? (
                                    <GlobalLoader className="col-span-3" />
                                ) : suggestions.length > 0 ? (
                                    <>
                                        {suggestions.map((feed: any) => (
                                            <FeedCard
                                                key={feed.id}
                                                feed={feed}
                                            />
                                        ))}
                                        <div className="col-span-3 py-4">
                                            <InfiniteLoader 
                                                onLoadMore={fetchNextSuggestions}
                                                hasMore={hasNextSuggestions}
                                                isLoading={isFetchingNextSuggestions}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <EmptyState title="No feeds available." description="There are no feeds to discover right now." className="col-span-3" />
                                )}
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="explore" className="mt-0">
                    <FeedSearch
                        onSearch={setSearchQuery}
                        placeholder="Search feeds..."
                        isLoading={isSearchFetching}
                    />
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {searchQuery ? "Search Results" : "Discover New Feeds"}
                    </h2>
                    <Tabs value={filter} onValueChange={(val) => updateParams({ filter: val })}>
                        <TabsList className="grid grid-cols-4 w-full mb-6 bg-gray-100 rounded-full">
                            <TabsTrigger value="all" className="rounded-full">
                                {searchQuery ? "Results" : "For You"}
                            </TabsTrigger> 
                            <TabsTrigger value="popular" className="rounded-full" disabled={!!searchQuery}>
                                Popular
                            </TabsTrigger>
                            <TabsTrigger value="sports" className="rounded-full" disabled={!!searchQuery}>
                                Sports
                            </TabsTrigger>
                            <TabsTrigger value="movies" className="rounded-full" disabled={!!searchQuery}>
                                Movies
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                {searchQuery ? (
                                    isSearchLoading ? (
                                        <GlobalLoader className="col-span-2" />
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map((feed: any) => (
                                            <FeedCard
                                                key={feed.id}
                                                feed={feed}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState title="No results found." className="col-span-2" />
                                    )
                                ) : (
                                    feeds.map((feed: any) => (
                                        <CommunityCard key={feed.id} community={feed} />
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="popular" className="mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                {feeds.slice(0, 4).map((feed: any) => (
                                    <CommunityCard key={feed.id} community={feed} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="sports" className="mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                {feeds
                                    .filter((f: any) => f.category === "Sports")
                                    .map((feed: any) => (
                                        <CommunityCard key={feed.id} community={feed} />
                                    ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="movies" className="mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                {feeds
                                    .filter((f: any) => f.category === "Movies")
                                    .map((feed: any) => (
                                        <CommunityCard key={feed.id} community={feed} />
                                    ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FeedsTab;
