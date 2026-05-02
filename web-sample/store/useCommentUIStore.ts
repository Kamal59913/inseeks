import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface CommentUIState {
  /** Set of postIds whose comment section is open */
  openPostIds: string[];
  /** Set of keys "postId:commentId" whose replies are expanded */
  expandedReplies: string[];

  // Actions
  togglePost: (postId: string | number) => void;
  isPostOpen: (postId: string | number) => boolean;
  toggleReplies: (postId: string | number, commentId: string | number) => void;
  isRepliesExpanded: (
    postId: string | number,
    commentId: string | number,
  ) => boolean;
  clear: () => void;
}

const replyKey = (postId: string | number, commentId: string | number) =>
  `${postId}:${commentId}`;

export const useCommentUIStore = create<CommentUIState>()(
  devtools(
    persist(
      (set, get) => ({
        openPostIds: [],
        expandedReplies: [],

        togglePost: (postId) => {
          const id = String(postId);
          set((state) => ({
            openPostIds: state.openPostIds.includes(id)
              ? state.openPostIds.filter((p) => p !== id)
              : [...state.openPostIds, id],
          }));
        },

        isPostOpen: (postId) => get().openPostIds.includes(String(postId)),

        toggleReplies: (postId, commentId) => {
          const key = replyKey(postId, commentId);
          set((state) => ({
            expandedReplies: state.expandedReplies.includes(key)
              ? state.expandedReplies.filter((k) => k !== key)
              : [...state.expandedReplies, key],
          }));
        },

        isRepliesExpanded: (postId, commentId) =>
          get().expandedReplies.includes(replyKey(postId, commentId)),

        clear: () => set({ openPostIds: [], expandedReplies: [] }),
      }),
      {
        name: "avom-comment-ui",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: "CommentUIStore" },
  ),
);
