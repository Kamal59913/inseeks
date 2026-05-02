"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ImageOff, Rss } from "lucide-react";
import { Card, CardContent, Button } from "@repo/ui/index";
import { LinkifiedText } from "@/components/ui/linkified-text";

interface FeedSuggestion {
  id: number;
  title: string;
  creator_user_id: number;
  main_post_id: number | null;
  created_at: string;
  updated_at: string;
}

interface ProposedFeedCardProps {
  feed: FeedSuggestion;
}

export const ProposedFeedCard = ({ feed }: ProposedFeedCardProps) => {
  const router = useRouter();
  const feedHref = `/feed/${feed.id}`;

  const handleCardNavigation = (
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;
    if (target.closest("a,button,input,textarea,select,[role='button']")) {
      return;
    }

    router.push(feedHref);
  };

  return (
    <div
      className="block h-full cursor-pointer"
      onClick={handleCardNavigation}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardNavigation(event);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <Card className="rounded-2xl shadow-none border border-gray-200 bg-white overflow-hidden h-full hover:border-gray-300 transition-colors">
        <div className="relative h-32 w-full bg-gray-100 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <ImageOff className="w-8 h-8 text-gray-300" />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base text-gray-900 mb-1 truncate" title={feed.title}>
            {feed.title}
          </h3>
          {(feed as any).description && (
            <LinkifiedText
              as="p"
              text={(feed as any).description}
              className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed"
            />
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Rss className="w-3.5 h-3.5" />
              <span>Suggested Feed</span>
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs font-medium rounded-full hover:bg-primary hover:text-white transition-colors"
                onClick={(e) => {
                    e.preventDefault();
                    // Add follow/subscribe logic here if/when available
                }}
            >
                View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
