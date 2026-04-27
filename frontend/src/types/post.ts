export interface PostAttachment {
  url: string;
  resourceType?: string;
  mimeType?: string;
  originalName?: string;
  bytes?: number;
}

export interface Post {
  _id: string;
  title?: string;
  description?: string;
  image?: string;
  attachments?: PostAttachment[];
  images?: string[];
  video?: string;
  envname?: string;
  owner?: {
    _id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
  likes?: string[];
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  comment: string;
  owner?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt?: string;
}

export interface Environment {
  _id: string;
  envName: string;
  EnvDescription: string;
  envCoverImage?: string;
  owner?: string;
  createdAt?: string;
}
