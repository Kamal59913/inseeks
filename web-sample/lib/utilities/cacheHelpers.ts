/**
 * Pure helper functions for surgical React Query cache updates.
 * These handle the complex "business logic" of how data structures change,
 * keeping the component/hook code clean and maintainable.
 */

interface Reaction {
  reaction_type_id: number;
  emoji: string;
  count: number;
}

interface ItemWithReactions {
  id: number | string;
  reactions_total: number;
  top_reactions: Reaction[];
  is_reacted: boolean;
  viewer_reaction_type_id: number | null;
  viewer_reaction_emoji: string | null;
  [key: string]: any;
}

/**
 * Logic for applying or removing a reaction from an item (Post or Comment).
 */
export const applyReactionLogic = (
  item: ItemWithReactions,
  reactionTypeId: number,
  emoji: string,
  isRemoving: boolean,
): ItemWithReactions => {
  const currentTypeId = item.viewer_reaction_type_id;
  const currentEmoji = item.viewer_reaction_emoji;

  let newTotal = item.reactions_total || 0;
  let newTopReactions = [...(item.top_reactions || [])];

  if (isRemoving) {
    // 1. Decr total
    newTotal = Math.max(0, newTotal - 1);

    // 2. Adjust top_reactions
    newTopReactions = newTopReactions
      .map((r) =>
        r.reaction_type_id === reactionTypeId
          ? { ...r, count: (r.count || 1) - 1 }
          : r,
      )
      .filter((r) => r.count > 0);

    return {
      ...item,
      is_reacted: false,
      viewer_reaction_type_id: null,
      viewer_reaction_emoji: null,
      reactions_total: newTotal,
      top_reactions: newTopReactions,
    };
  } else {
    // Adding or Changing
    const isChanging = item.is_reacted && currentTypeId !== reactionTypeId;
    const isNew = !item.is_reacted;

    if (isNew) newTotal++;

    // Adjust top_reactions
    if (isChanging) {
      // Decrease old
      newTopReactions = newTopReactions
        .map((r) =>
          r.reaction_type_id === currentTypeId
            ? { ...r, count: (r.count || 1) - 1 }
            : r,
        )
        .filter((r) => r.count > 0);
    }

    // Increase new
    let found = false;
    newTopReactions = newTopReactions.map((r) => {
      if (r.reaction_type_id === reactionTypeId) {
        found = true;
        return { ...r, count: (r.count || 0) + 1 };
      }
      return r;
    });

    if (!found) {
      newTopReactions.push({
        reaction_type_id: reactionTypeId,
        emoji,
        count: 1,
      });
    }

    // Sort and limit to top 3
    newTopReactions.sort((a, b) => (b.count || 0) - (a.count || 0));
    newTopReactions = newTopReactions.slice(0, 3);

    return {
      ...item,
      is_reacted: true,
      viewer_reaction_type_id: reactionTypeId,
      viewer_reaction_emoji: emoji,
      reactions_total: newTotal,
      top_reactions: newTopReactions,
    };
  }
};

/**
 * Logic for recursively updating a comment in a tree.
 */
export const updateCommentInTree = (
  comments: any[],
  commentId: number | string,
  updateFn: (c: any) => any,
): any[] => {
  if (!Array.isArray(comments)) return comments;
  return comments.map((c) => {
    if (String(c.id) === String(commentId)) {
      return updateFn(c);
    }
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: updateCommentInTree(c.replies, commentId, updateFn),
      };
    }
    return c;
  });
};

/**
 * Logic for removing a comment from a tree and updating parent counts.
 */
export const removeCommentFromTree = (
  comments: any[],
  commentId: number | string,
): any[] => {
  if (!Array.isArray(comments)) return comments;
  return comments
    .filter((c) => String(c.id) !== String(commentId))
    .map((c) => {
      const hasRemovedReply = c.replies?.some(
        (r: any) => String(r.id) === String(commentId),
      );
      return {
        ...c,
        replies: c.replies ? removeCommentFromTree(c.replies, commentId) : [],
        total_replies: hasRemovedReply
          ? Math.max(0, (c.total_replies || 0) - 1)
          : c.total_replies,
      };
    });
};

/**
 * Logic for toggling a "following" state on a post or user object.
 */
export const toggleFollowLogic = (item: any, isFollowing: boolean) => {
  return {
    ...item,
    is_following_author: isFollowing,
    is_following: isFollowing,
    isFollowing: isFollowing,
  };
};

/**
 * Logic for toggling a post save state.
 */
export const toggleSaveLogic = (post: any, isSaved: boolean) => {
  return {
    ...post,
    is_saved: isSaved,
    isSaved: isSaved,
  };
};

/**
 * Logic for reposting.
 */
export const applyRepostLogic = (post: any) => {
  const currentCount = post.reposts_count || post.reposts || 0;
  return {
    ...post,
    reposts_count: currentCount + 1,
    reposts: currentCount + 1,
    is_reposted: true,
  };
};

/**
 * Generic logic for toggling subscription/follow state.
 */
export const toggleFollowState = (item: any, isFollowing: boolean) => {
  const currentSubCount = item.subscriber_count ?? 0;
  const currentMembers = item.members ?? 0;

  const newSubCount = isFollowing
    ? currentSubCount + 1
    : Math.max(0, currentSubCount - 1);
  const newMembers = isFollowing
    ? Number(currentMembers) + 1
    : Math.max(0, Number(currentMembers) - 1);

  return {
    ...item,
    is_following: isFollowing,
    isFollowing: isFollowing,
    is_subscribed: isFollowing,
    isSubscribed: isFollowing,
    is_followed: isFollowing,
    isFollowed: isFollowing,
    subscriber_count: newSubCount,
    members: newMembers,
  };
};
