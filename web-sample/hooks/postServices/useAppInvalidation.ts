import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useAppInvalidation = () => {
  const queryClient = useQueryClient();

  /**
   * Robust internal helper to update or remove items in various response shapes.
   * Handles:
   * - paginated pages
   * - { data: [...] }
   * - { data: { items: [...] } }
   * - direct arrays [...]
   */
  const patchCacheData = useCallback(
    (
      oldData: any,
      matchFn: (p: any) => boolean,
      updateOrRemoveFn: ((p: any) => any) | null,
      itemsKey?: string,
    ) => {
      if (!oldData) return oldData;

      const processItems = (items: any[]): any[] => {
        if (!Array.isArray(items)) return items;
        if (updateOrRemoveFn === null) {
          return items.filter((item: any) => !matchFn(item));
        }
        return items.map((item: any) =>
          matchFn(item) ? updateOrRemoveFn(item) : item,
        );
      };

      const patchPage = (data: any) => {
        if (!data) return data;

        // Try explicit itemsKey first if provided
        if (itemsKey && Array.isArray(data[itemsKey])) {
          return { ...data, [itemsKey]: processItems(data[itemsKey]) };
        }

        // Handle nested { data: { data: [...] } } or { data: [...] }
        if (data.data) {
          if (Array.isArray(data.data)) {
            return { ...data, data: processItems(data.data) };
          }
          if (itemsKey && Array.isArray(data.data[itemsKey])) {
            return {
              ...data,
              data: {
                ...data.data,
                [itemsKey]: processItems(data.data[itemsKey]),
              },
            };
          }
          // Special case for { data: { items: [...] } }
          if (Array.isArray(data.data.items)) {
            return {
              ...data,
              data: {
                ...data.data,
                items: processItems(data.data.items),
              },
            };
          }
        }

        // Handle { items: [...] }
        if (Array.isArray(data.items)) {
          return { ...data, items: processItems(data.items) };
        }

        // Handle { communities: [...] }
        if (Array.isArray(data.communities)) {
          return { ...data, communities: processItems(data.communities) };
        }

        // Handle { feeds: [...] }
        if (Array.isArray(data.feeds)) {
          return { ...data, feeds: processItems(data.feeds) };
        }

        // Direct array
        if (Array.isArray(data)) {
          return processItems(data);
        }

        return data;
      };

      if (oldData.pages && Array.isArray(oldData.pages)) {
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => patchPage(page)),
        };
      }

      return patchPage(oldData);
    },
    [],
  );

  const updateAllPostsCache = useCallback(
    (matchFn: (p: any) => boolean, updateFn: (p: any) => any) => {
      const queryBaseKeys = [
        ["posts"],
        ["posts-saved"],
        ["get-community-posts"],
        ["get-followed-community-posts"],
      ];

      queryBaseKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (oldData: any) =>
          patchCacheData(oldData, matchFn, updateFn, "posts"),
        );
      });
    },
    [queryClient, patchCacheData],
  );

  /**
   * Remove a post from filtered `get-followed-community-posts` queries.
   * Uses getQueryCache().findAll() to access the filter from each query's key.
   * @param filter - The filter tab to remove the post from: "liked", "saved", or "subscribed"
   * @param matchFn - Predicate to match which posts to remove
   */
  const removePostFromFilteredFeeds = useCallback(
    (filter: "liked" | "saved" | "subscribed", matchFn: (p: any) => boolean) => {
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["get-followed-community-posts"] });

      queries.forEach((query) => {
        const queryFilter = query.queryKey[3];
        if (queryFilter !== filter) return;

        queryClient.setQueryData(query.queryKey, (oldData: any) =>
          patchCacheData(oldData, matchFn, null, "posts"),
        );
      });
    },
    [queryClient, patchCacheData],
  );

  const removePostFromFilteredViews = useCallback(
    (
      filter: "liked" | "saved" | "subscribed",
      matchFn: (p: any) => boolean,
    ) => {
      const postQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["posts"] });

      postQueries.forEach((query) => {
        const queryFilter = query.queryKey[1];
        if (queryFilter !== filter) return;

        queryClient.setQueryData(query.queryKey, (oldData: any) =>
          patchCacheData(oldData, matchFn, null),
        );
      });

      removePostFromFilteredFeeds(filter, matchFn);
    },
    [patchCacheData, queryClient, removePostFromFilteredFeeds],
  );

  const updatePostCache = useCallback(
    (postId: string | number, updateFn: (post: any) => any) => {
      updateAllPostsCache((p) => String(p.id) === String(postId), updateFn);
      // Individual post query matching
      queryClient.setQueriesData(
        {
          predicate: (q) =>
            q.queryKey[0] === "post" &&
            String(q.queryKey[1]) === String(postId),
        },
        (oldData: any) => {
          if (!oldData) return oldData;
          const postData = oldData.data || oldData;
          if (typeof postData === "object" && !Array.isArray(postData)) {
            const updated = updateFn(postData);
            return oldData.data ? { ...oldData, data: updated } : updated;
          }
          return oldData;
        },
      );
    },
    [updateAllPostsCache, queryClient],
  );

  const updateCommentCache = useCallback(
    (postId: string | number, updateFn: (comments: any[]) => any[]) => {
      queryClient.setQueriesData(
        {
          predicate: (q) =>
            q.queryKey[0] === "comments" &&
            String(q.queryKey[1]) === String(postId),
        },
        (oldData: any) => {
          if (!oldData) return oldData;

          const patchCommentsContainer = (container: any) => {
            if (!container) return container;

            // 1. Try common object structures
            if (container.data && Array.isArray(container.data.comments)) {
              return {
                ...container,
                data: {
                  ...container.data,
                  comments: updateFn(container.data.comments),
                },
              };
            }
            if (Array.isArray(container.comments)) {
              return { ...container, comments: updateFn(container.comments) };
            }
            if (Array.isArray(container.data)) {
              return { ...container, data: updateFn(container.data) };
            }
            // 2. Direct array
            if (Array.isArray(container)) {
              return updateFn(container);
            }
            return container;
          };

          if (oldData.pages && Array.isArray(oldData.pages)) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) =>
                patchCommentsContainer(page),
              ),
            };
          }

          return patchCommentsContainer(oldData);
        },
      );
    },
    [queryClient],
  );

  const updateCommentThreadCache = useCallback(
    (commentId: string | number, updateFn: (comment: any) => any) => {
      queryClient.setQueriesData(
        {
          predicate: (q) =>
            q.queryKey[0] === "comment" &&
            String(q.queryKey[1]) === String(commentId),
        },
        (oldData: any) => {
          if (!oldData) return oldData;
          const commentData = oldData.data || oldData;
          const updatedComment = updateFn(commentData);
          return oldData.data
            ? { ...oldData, data: updatedComment }
            : updatedComment;
        },
      );
    },
    [queryClient],
  );

  const updateCommunityCache = useCallback(
    (
      communityId: string | number,
      isNowFollowing: boolean,
      updateFn: (c: any) => any,
    ) => {
      // 1. Update list views
      const listKeys = [
        ["get-communities"],
        ["search-communities"],
        ["community-recommendations"],
      ];

      listKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (oldData: any) =>
          patchCacheData(
            oldData,
            (c: any) => String(c.id || c.community_id) === String(communityId),
            updateFn,
          ),
        );
      });

      // 2. Targeted Followed Communities List (Pruning)
      queryClient.setQueriesData(
        { queryKey: ["get-followed-communities"] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return patchCacheData(
            oldData,
            (c: any) => String(c.id || c.community_id) === String(communityId),
            isNowFollowing ? updateFn : null, // REMOVE if not following
          );
        },
      );

      // 3. Update individual subscription status query (Predicate match for string/number)
      queryClient.setQueriesData(
        {
          predicate: (q) =>
            q.queryKey[0] === "community-subscription" &&
            String(q.queryKey[1]) === String(communityId),
        },
        (old: any) => {
          if (!old) return old;
          return { ...old, status: isNowFollowing };
        },
      );

      // 4. Update any posts from this community across all feeds
      updateAllPostsCache(
        (p: any) =>
          String(p.community_id || p.community?.id) === String(communityId),
        (p: any) => ({
          ...p,
          community: p.community ? updateFn(p.community) : p.community,
          is_subscribed: isNowFollowing,
          is_following_community: isNowFollowing,
        }),
      );

      // 5. Special handling for followed posts feed (Remove if unfollowing)
      if (!isNowFollowing) {
        queryClient.setQueriesData(
          { queryKey: ["get-followed-community-posts"] },
          (oldData: any) => {
            return patchCacheData(
              oldData,
              (p: any) =>
                String(p.community_id || p.community?.id) ===
                String(communityId),
              null,
              "posts",
            );
          },
        );

        removePostFromFilteredViews(
          "subscribed",
          (p: any) =>
            String(p.community_id || p.community?.id) === String(communityId),
        );
      }

      // 6. Update individual community query
      queryClient.setQueriesData(
        {
          predicate: (q) =>
            q.queryKey[0] === "get-community" &&
            String(q.queryKey[1]) === String(communityId),
        },
        (oldData: any) => {
          if (!oldData) return oldData;
          // Handle Axios response { data: { status, data: { ...community } } }
          const body = oldData.data || oldData;
          if (body.data && !Array.isArray(body.data)) {
            const updatedCommunity = updateFn(body.data);
            const updatedBody = { ...body, data: updatedCommunity };
            return oldData.data
              ? { ...oldData, data: updatedBody }
              : updatedBody;
          }
          const updated = updateFn(body);
          return oldData.data ? { ...oldData, data: updated } : updated;
        },
      );
    },
    [queryClient, patchCacheData, updateAllPostsCache],
  );

  const updateFeedCache = useCallback(
    (
      feedId: string | number,
      isNowFollowing: boolean,
      updateFn: (f: any) => any,
    ) => {
      const queryBaseKeys = [
        ["feed-suggestions"],
        ["search-feeds"],
        ["get-community-top-feeds"],
      ];
      queryBaseKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (oldData: any) =>
          patchCacheData(
            oldData,
            (f: any) => String(f.id) === String(feedId),
            updateFn,
          ),
        );
      });

      // Update any posts belonging to this feed
      updateAllPostsCache(
        (p: any) => String(p.feed_id || p.feed?.id) === String(feedId),
        (p: any) => ({
          ...p,
          feed: p.feed ? updateFn(p.feed) : p.feed,
          is_followed: isNowFollowing,
          is_following_feed: isNowFollowing,
        }),
      );

      // Update individual feed query
      queryClient.setQueriesData(
        {
          predicate: (q) =>
            q.queryKey[0] === "get-feed-by-id" &&
            String(q.queryKey[1]) === String(feedId),
        },
        (oldData: any) => {
          if (!oldData) return oldData;
          // Handle Axios response { data: { status, data: { ...feed } } }
          const body = oldData.data || oldData;
          if (body.data && !Array.isArray(body.data)) {
            const updatedFeed = updateFn(body.data);
            const updatedBody = { ...body, data: updatedFeed };
            return oldData.data
              ? { ...oldData, data: updatedBody }
              : updatedBody;
          }
          const updated = updateFn(body);
          return oldData.data ? { ...oldData, data: updated } : updated;
        },
      );
    },
    [queryClient, patchCacheData],
  );

  const updateUserCache = useCallback(
    (username: string, updateFn: (user: any) => any) => {
      queryClient.setQueriesData(
        { queryKey: ["user", username] },
        (oldData: any) => {
          if (!oldData) return oldData;
          const userData = oldData.data || oldData;
          const updatedUser = updateFn(userData);
          return oldData.data ? { ...oldData, data: updatedUser } : updatedUser;
        },
      );
    },
    [queryClient],
  );

  const updateAllUsersCache = useCallback(
    (matchFn: (u: any) => boolean, updateFn: (u: any) => any) => {
      const queryBaseKeys = [["users"], ["user-recommendations"]];

      queryBaseKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (oldData: any) =>
          patchCacheData(oldData, matchFn, updateFn),
        );
      });
    },
    [queryClient, patchCacheData],
  );

  const invalidatePost = useCallback(
    (postId?: string | number) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-saved"] });
      queryClient.invalidateQueries({ queryKey: ["get-community-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["get-followed-community-posts"],
      });
      if (postId)
        queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
    },
    [queryClient],
  );

  const invalidateFeed = useCallback(
    (feedId?: string | number) => {
      queryClient.invalidateQueries({ queryKey: ["feed-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["search-feeds"] });
      if (feedId)
        queryClient.invalidateQueries({ queryKey: ["feed", String(feedId)] });
    },
    [queryClient],
  );

  const removeFeedFromCache = useCallback(
    (feedId: string | number) => {
      const queryBaseKeys = [
        ["feed-suggestions"],
        ["search-feeds"],
        ["get-community-top-feeds"],
      ];

      queryBaseKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (oldData: any) =>
          patchCacheData(
            oldData,
            (f: any) => String(f.id) === String(feedId),
            null,
            "feeds",
          ),
        );
      });

      queryClient.removeQueries({
        predicate: (q) =>
          q.queryKey[0] === "get-feed-by-id" &&
          String(q.queryKey[1]) === String(feedId),
      });
    },
    [patchCacheData, queryClient],
  );

  const removeUserPostsFromCache = useCallback(
    (username: string) => {
      const matchFn = (p: any) =>
        (p.author_username || p.author?.username)?.toLowerCase() ===
        username?.toLowerCase();
      const queryBaseKeys = [
        ["posts"],
        ["posts-saved"],
        ["get-community-posts"],
        ["get-followed-community-posts"],
      ];

      queryBaseKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (oldData: any) =>
          patchCacheData(oldData, matchFn, null, "posts"),
        );
      });
    },
    [queryClient, patchCacheData],
  );

  const removePostFromCache = useCallback(
    (postId: string | number) => {
      const matchFn = (p: any) => String(p.id) === String(postId);
      const queryBaseKeys = [
        ["posts"],
        ["posts-saved"],
        ["get-community-posts"],
        ["get-followed-community-posts"],
      ];

      queryBaseKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (oldData: any) =>
          patchCacheData(oldData, matchFn, null, "posts"),
        );
      });

      // Also remove from individual post query
      queryClient.removeQueries({
        queryKey: ["post", String(postId)],
      });
    },
    [queryClient, patchCacheData],
  );

  const removeCommentFromCache = useCallback(
    (commentId: string | number, postId: string | number) => {
      updateCommentCache(postId, (comments) => {
        return comments.filter((c: any) => String(c.id) !== String(commentId));
      });
    },
    [updateCommentCache],
  );

  const removeUserCommentsFromCache = useCallback(
    (username: string) => {
      const matchFn = (c: any) =>
        (c.author_username || c.user?.username || c.author?.username) ===
        username;

      // Recursive filter for comment tree
      const filterTree = (items: any[]): any[] => {
        if (!Array.isArray(items)) return items;
        return items
          .filter((item) => !matchFn(item))
          .map((item) => ({
            ...item,
            replies: item.replies ? filterTree(item.replies) : item.replies,
          }));
      };

      // 1. Optimistic Update: Manually prune from cache (active AND inactive)
      queryClient.setQueriesData({ queryKey: ["comments"] }, (oldData: any) => {
        if (!oldData) return oldData;
        const patchCommentsContainer = (container: any) => {
          if (!container) return container;
          if (container.data && Array.isArray(container.data.comments)) {
            return {
              ...container,
              data: {
                ...container.data,
                comments: filterTree(container.data.comments),
              },
            };
          }
          if (Array.isArray(container.comments)) {
            return { ...container, comments: filterTree(container.comments) };
          }
          if (Array.isArray(container.data)) {
            return { ...container, data: filterTree(container.data) };
          }
          if (Array.isArray(container)) return filterTree(container);
          return container;
        };

        if (oldData.pages && Array.isArray(oldData.pages)) {
          return {
            ...oldData,
            pages: oldData.pages.map((p: any) => patchCommentsContainer(p)),
          };
        }
        return patchCommentsContainer(oldData);
      });

      // 2. Force refetch of all active comment-related components
      queryClient.refetchQueries({ queryKey: ["comments"], type: "active" });
      queryClient.refetchQueries({ queryKey: ["comment"], type: "active" });
    },
    [queryClient],
  );

  return {
    invalidatePost,
    invalidateFeed,
    removeFeedFromCache,
    updatePostCache,
    updateAllPostsCache,
    updateCommentCache,
    updateCommentThreadCache,
    updateUserCache,
    updateAllUsersCache,
    updateCommunityCache,
    removePostFromFilteredViews,
    updateFeedCache,
    removeUserPostsFromCache,
    removeUserCommentsFromCache,
    removePostFromCache,
    removeCommentFromCache,
  };
};
