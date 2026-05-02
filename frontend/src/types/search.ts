export type SearchScope = "all" | "people" | "spaces" | "posts";
export interface SearchPerson {
  _id: string;
  username: string;
  fullname?: string;
  avatar?: string;
  about?: string;
  isFollowing?: boolean;
}
export interface SearchSpace {
  _id: string;
  name: string;
  description?: string;
  envAvatar?: string;
  isJoined?: boolean;
}
export interface SearchPost {
  _id: string;
  type: "blogpost" | "image" | "video";
  title?: string;
  description?: string;
  image?: string;
  video?: string;
  community?: string;
  createdAt?: string;
  author?: {
    _id: string;
    username: string;
    fullname?: string;
    avatar?: string;
  } | null;
}
export interface SearchResponse {
  query: string;
  scope: SearchScope;
  people: SearchPerson[];
  spaces: SearchSpace[];
  posts: SearchPost[];
  pagination: {
    limit: number;
    offset: number;
    nextOffset: number | null;
    hasMore: boolean;
  };
}
