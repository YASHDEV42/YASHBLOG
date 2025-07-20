// import { Post } from "@/types";
// import { apiClient } from "../api-client";

// /**
//  * Post-related types (extending the main Post type)
//  */

// export interface CreatePostRequest {
//   title: string;
//   content: string;
//   excerpt?: string;
//   categories?: string[];
//   published?: boolean;
//   [key: string]: unknown;
// }

// export interface UpdatePostRequest {
//   title?: string;
//   content?: string;
//   excerpt?: string;
//   categories?: string[];
//   published?: boolean;
//   [key: string]: unknown;
// }

// export interface PostsResponse {
//   posts: Post[];
//   total?: number;
//   page?: number;
//   limit?: number;
// }

// /**
//  * Posts Service
//  * Handles all post-related API calls
//  */
// export class PostService {
//   private static readonly BASE_PATH = "/api/post";

//   /**
//    * Get all posts
//    */
//   static async getAllPosts(): Promise<Post[]> {
//     try {
//       const response = await apiClient.get<PostsResponse>(this.BASE_PATH);
//       return response.posts || [];
//     } catch (error) {
//       console.error("Failed to fetch posts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get a single post by slug
//    */
//   static async getPost(slug: string): Promise<Post | null> {
//     try {
//       const response = await apiClient.get<{ post: Post }>(
//         `${this.BASE_PATH}/${slug}`
//       );
//       console.log("Fetched post:", response);
//       return response;
//     } catch (error) {
//       console.error(`Failed to fetch post ${slug}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Create a new post
//    */
//   static async createPost(data: CreatePostRequest): Promise<Post> {
//     try {
//       const response = await apiClient.post<{ post: Post }>(
//         this.BASE_PATH,
//         data
//       );
//       return response.post;
//     } catch (error) {
//       console.error("Failed to create post:", error);
//       throw error;
//     }
//   }

//   /**
//    * Update an existing post
//    */
//   static async updatePost(
//     slug: string,
//     data: UpdatePostRequest
//   ): Promise<Post> {
//     try {
//       const response = await apiClient.put<{ post: Post }>(
//         `${this.BASE_PATH}/${slug}`,
//         data
//       );
//       return response.post;
//     } catch (error) {
//       console.error(`Failed to update post ${slug}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Delete a post
//    */
//   static async deletePost(slug: string): Promise<void> {
//     try {
//       await apiClient.delete(`${this.BASE_PATH}/${slug}`);
//     } catch (error) {
//       console.error(`Failed to delete post ${slug}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Toggle post publish status
//    */
//   static async togglePublishStatus(slug: string): Promise<Post> {
//     try {
//       const response = await apiClient.put<{ post: Post }>(
//         `${this.BASE_PATH}/${slug}/publish`
//       );
//       return response.post;
//     } catch (error) {
//       console.error(`Failed to toggle publish status for ${slug}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Toggle like on a post
//    */
//   static async toggleLike(slug: string): Promise<Post> {
//     try {
//       const response = await apiClient.put<{ post: Post }>(
//         `${this.BASE_PATH}/${slug}/like`
//       );
//       return response.post;
//     } catch (error) {
//       console.error(`Failed to toggle like for ${slug}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Get posts by current user (author)
//    */
//   static async getMyPosts(): Promise<Post[]> {
//     try {
//       const response = await apiClient.get<PostsResponse>(
//         `${this.BASE_PATH}/author`
//       );
//       return response.posts || [];
//     } catch (error) {
//       console.error("Failed to fetch user posts:", error);
//       throw error;
//     }
//   }
// }
