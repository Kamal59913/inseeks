export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  about?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserListItem {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
}
