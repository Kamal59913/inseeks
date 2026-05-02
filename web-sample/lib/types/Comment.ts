export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  user_id: number;
  text: string;
  created_at: string;
  updated_at: string;
  edited: boolean;
  edited_at: string | null;
  edit_count: number;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: number | null;
  author_full_name: string;
  author_username: string;
  author_profile_image: string | null;
  reactions_total: number;
  top_reactions: Array<{
    reaction_type_id: number;
    emoji: string;
    count: number;
  }>;
  is_reacted: boolean;
  viewer_reaction_type_id: number | null;
  viewer_reaction_emoji: string | null;
  total_replies: number;
  replies: Comment[];
  user?: {
    id: number;
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface CreateCommentPayload {
  post_id: number;
  text: string;
  parent_comment_id?: number;
}

export interface GetCommentsParams {
  post_id: number | string;
  offset?: number;
  limit?: number;
}
