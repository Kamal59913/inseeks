export interface Post {
  id: number;
  user_id: number;
  text_content: string;
  type: "text" | "photo" | "video";
  is_quote: boolean;
  created_at: string;
  updated_at: string;
  media: Array<{
    id: number;
    url: string;
    thumbnail_url?: string;
    media_type: "photo" | "video";
  }>;
  author_full_name: string;
  author_username: string;
  author_profile_image: string | null;
  author_bio: string | null;
  is_following_author: boolean;
  is_saved: boolean;
  reposts_count: number;
  comments_count: number;
  reactions_total: number;
  top_reactions: Array<{
    reaction_type_id: number;
    emoji: string;
    count: number;
  }>;
  is_reacted: boolean;
  viewer_reaction_type_id: number | null;
  viewer_reaction_emoji: string | null;
}

export interface PostResponse {
  message: string;
  data: Post;
  status: boolean;
}
