// ==================== ENUMS ====================
export enum NotificationType {
  Like = "like",
  Comment = "comment",
  Follow = "follow",
  Reply = "reply",
  Post = "post",
}

// ==================== BASE INTERFACES ====================

// Base User interface (matches your backend User model)
export interface User {
  _id: string;
  email: string;
  name: string;
  password?: string; // Optional since we usually don't send passwords to frontend
  profilePicture?: string;
  bio?: string;
  posts: string[]; // Array of Post IDs
  likedPosts: string[]; // Array of Post IDs (matches backend)
  comments: string[]; // Array of Comment IDs
  followers: string[]; // Array of User IDs
  following: string[]; // Array of User IDs
  notifications: string[]; // Array of Notification IDs
  createdAt: string;
  updatedAt: string;
}

// Populated User interface for when user data is populated
export interface PopulatedUser
  extends Omit<User, "posts" | "likedPosts" | "comments" | "notifications"> {
  posts: Post[];
  likedPosts: Post[];
  comments: Comment[];
  notifications: Notification[];
}

// Base Post interface (matches your backend Post model)
export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt?: string; // Optional since it's not required in backend
  slug: string;
  published: boolean;
  author: string; // User ID when not populated
  categories: string[];
  comments: string[]; // Array of Comment IDs
  likes: string[]; // Array of User IDs (matches backend)
  metadata: {
    views: number;
    likes: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Populated Post interface for when author and comments are populated
export interface PopulatedPost
  extends Omit<Post, "author" | "comments" | "likes"> {
  author: User;
  comments: Comment[];
  likes: User[]; // Populated User objects
}

// Complete Post type (for full population)
export type CompletePost = PopulatedPost;

// Comment interface (matches your backend Comment model)
export interface Comment {
  _id: string;
  content: string;
  user: string; // User ID when not populated
  post: string; // Post ID
  replies: string[]; // Array of Comment IDs
  likes: string[]; // Array of User IDs
  metadata: {
    // Fixed: matches backend structure
    likes: number;
    replies: number;
  };
  parentComment?: string; // Comment ID
  createdAt: string;
  updatedAt: string;
}

// Populated Comment interface
export interface PopulatedComment
  extends Omit<Comment, "user" | "replies" | "likes"> {
  user: User;
  replies: Comment[];
  likes: User[];
}

// Notification interface (matches your backend Notification model)
export interface Notification {
  _id: string;
  user: string; // User ID
  type: NotificationType;
  content: string;
  post?: string; // Post ID (optional)
  comment?: string; // Comment ID (optional)
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Populated Notification interface
export interface PopulatedNotification
  extends Omit<Notification, "user" | "post" | "comment"> {
  user: User;
  post?: Post;
  comment?: Comment;
}

// ==================== API SPECIFIC INTERFACES ====================

// API User interface (what comes from the backend during auth)
export interface ApiUser {
  _id: string;
  email: string;
  name: string; // Changed from username to name to match your backend
  profilePicture?: string; // Changed from avatar to profilePicture
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== FORM INTERFACES ====================

// Update Profile Data
export interface UpdateProfileData {
  name: string;
  bio: string;
  profilePicture?: string;
}

// Change Password Data
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Login Form Data
export interface LoginFormData {
  email: string;
  password: string;
}

// Register Form Data
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Post Form Data
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  categories: string[];
  published: boolean;
}

// Comment Form Data
export interface CommentFormData {
  content: string;
  postId: string;
  parentCommentId?: string;
}

// ==================== API RESPONSE INTERFACES ====================

// Auth Response
export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token?: string;
}

// Post Response
export interface PostResponse {
  success: boolean;
  message: string;
  post: PopulatedPost;
}

// Posts Response
export interface PostsResponse {
  success: boolean;
  message: string;
  posts: PopulatedPost[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Comment Response
export interface CommentResponse {
  success: boolean;
  message: string;
  comment: PopulatedComment;
}

// ==================== UTILITY TYPES ====================

// For filtering posts
export interface PostFilters {
  category?: string;
  author?: string;
  published?: boolean;
  search?: string;
}

// For pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

// For sorting
export interface SortOptions {
  field: "createdAt" | "updatedAt" | "likes" | "views" | "title";
  order: "asc" | "desc";
}

// ==================== HELPER FUNCTIONS ====================

// Convert API User to User (updated to match your backend)
export function convertApiUserToUser(apiUser: ApiUser): User {
  return {
    _id: apiUser._id,
    email: apiUser.email,
    name: apiUser.name,
    profilePicture: apiUser.profilePicture,
    bio: apiUser.bio || "",
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

// Type guards for better type safety
export function isPopulatedPost(
  post: Post | PopulatedPost
): post is PopulatedPost {
  return typeof post.author === "object" && post.author !== null;
}

export function isPopulatedComment(
  comment: Comment | PopulatedComment
): comment is PopulatedComment {
  return typeof comment.user === "object" && comment.user !== null;
}

export function isPopulatedUser(
  user: User | PopulatedUser
): user is PopulatedUser {
  return (
    Array.isArray(user.posts) &&
    user.posts.length > 0 &&
    typeof user.posts[0] === "object"
  );
}

// ==================== DEPRECATED/REMOVED ====================
// Removed LikedPostsWithPostWithAuthor interface as it doesn't match backend models
// The backend User.likedPosts is just an array of Post IDs, not a complex object
