export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  posts: string[];
  likedPosts: string[];
  comments: string[];
  followers: string[];
  following: string[];
  notifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  author: string | User;
  categories: string[];
  comments: string[];
  likes: string[];
  metadata: {
    views: number;
    likes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type CompletePost = Post & {
  author: User;
  comments: Comment[];
  metadata: {
    views: number;
    likes: number;
  };
};
export interface Comment {
  _id: string;
  content: string;
  user: string;
  post: string;
  replies: string[];
  likes: string[];
  metadata_likes: number;
  metadata_replies: number;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
}

enum NotificationType {
  Like = "like",
  Comment = "comment",
  Follow = "follow",
  Reply = "reply",
  Post = "post",
}

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  content: string;
  post?: string;
  comment?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface LikedPostsWithPostWithAuthor {
  _id: string; // Like ID
  post: Post & { author: User };
  user: string; // User ID who liked
  createdAt: string;
}
export interface UpdateProfileData {
  name: string;
  bio: string;
  profilePicture: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// API User interface (what comes from the backend)
export interface ApiUser {
  _id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export function convertApiUserToUser(apiUser: ApiUser): User {
  return {
    _id: apiUser._id,
    email: apiUser.email,
    name: apiUser.username,
    password: "",
    profilePicture: apiUser.avatar,
    bio: "",
    posts: [],
    likedPosts: [],
    comments: [],
    followers: [],
    following: [],
    notifications: [],
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
  };
}
