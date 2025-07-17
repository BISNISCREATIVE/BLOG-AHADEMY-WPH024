export interface User {
  id: number;
  name: string;
  email: string;
  headline?: string;
  avatarUrl?: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  headline?: string;
  avatarUrl?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
  postId: number;
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  tags: string;
  image?: File;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  tags?: string;
  image?: File;
}

export interface CreateCommentData {
  content: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
