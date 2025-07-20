// import { apiClient } from "../api-client";
// import { User, PostWithMetadata } from "@/types";

// /**
//  * User-related types
//  */

// export interface LoginRequest {
//   email: string;
//   password: string;
//   [key: string]: unknown;
// }

// export interface RegisterRequest {
//   email: string;
//   password: string;
//   username: string;
//   [key: string]: unknown;
// }

// export interface AuthResponse {
//   user: User;
//   message: string;
// }

// /**
//  * User API Service
//  */
// export class UserService {
//   /**
//    * Get current authenticated user
//    */
//   static async getCurrentUser(): Promise<User | null> {
//     try {
//       const response = await apiClient.get<{ user: User }>("/api/user/current");
//       return response.user;
//     } catch (error) {
//       console.log("Failed to get current user:", error);

//       return null;
//     }
//   }

//   /**
//    * Login user
//    */
//   static async login(credentials: LoginRequest): Promise<AuthResponse> {
//     return apiClient.post<AuthResponse>("/api/user/login", credentials);
//   }

//   /**
//    * Register new user
//    */
//   static async register(userData: RegisterRequest): Promise<AuthResponse> {
//     return apiClient.post<AuthResponse>("/api/user/register", userData);
//   }

//   /**
//    * Logout user
//    */
//   static async logout(): Promise<{ message: string }> {
//     return apiClient.post<{ message: string }>("/api/user/logout");
//   }

//   /**
//    * Get user posts
//    */
//   static async getUserPosts(userId: string): Promise<unknown[]> {
//     return apiClient.get<PostWithMetadata[]>(`/api/user/posts/${userId}`);
//   }

//   /**
//    * Get user liked posts
//    */
//   static async getUserLikedPosts(userId: string): Promise<unknown[]> {
//     return apiClient.get<PostWithMetadata[]>(`/api/user/liked-posts/${userId}`);
//   }
// }
