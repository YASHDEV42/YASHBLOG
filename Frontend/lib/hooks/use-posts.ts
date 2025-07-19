import { useState, useEffect } from "react";
import { PostService } from "@/lib/services/post.service";
import { Post } from "@/types";

/**
 * Custom hook for posts data management
 * Provides a clean interface for components to interact with posts
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all posts
   */
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const postsData = await PostService.getAllPosts();
      setPosts(postsData);
      return { success: true, data: postsData };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch posts";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new post
   */
  const createPost = async (postData: {
    title: string;
    content: string;
    excerpt?: string;
    categories?: string[];
    published?: boolean;
  }) => {
    try {
      const newPost = await PostService.createPost(postData);
      setPosts((prev) => [newPost, ...prev]); // Add to beginning of list
      return { success: true, data: newPost };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create post";
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Update an existing post
   */
  const updatePost = async (
    slug: string,
    postData: {
      title?: string;
      content?: string;
      excerpt?: string;
      categories?: string[];
      published?: boolean;
    }
  ) => {
    try {
      const updatedPost = await PostService.updatePost(slug, postData);
      setPosts((prev) =>
        prev.map((post) => (post.slug === slug ? updatedPost : post))
      );
      return { success: true, data: updatedPost };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update post";
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Delete a post
   */
  const deletePost = async (slug: string) => {
    try {
      await PostService.deletePost(slug);
      setPosts((prev) => prev.filter((post) => post.slug !== slug));
      return { success: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete post";
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Toggle like on a post
   */
  const toggleLike = async (slug: string) => {
    try {
      const updatedPost = await PostService.toggleLike(slug);
      setPosts((prev) =>
        prev.map((post) => (post.slug === slug ? updatedPost : post))
      );
      return { success: true, data: updatedPost };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to toggle like";
      return { success: false, message: errorMessage };
    }
  };

  return {
    // State
    posts,
    loading,
    error,

    // Actions
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
  };
}

/**
 * Hook for a single post
 */
export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * Fetch single post
   */
  const fetchPost = async () => {
    if (!slug) return;
    console.log("Fetching post with slug:", slug);
    setLoading(true);
    setError(null);
    try {
      const postData = await PostService.getPost(slug);
      console.log("Fetched post:", postData);
      setPost(postData);
      console.log("Post set in state:", postData);
      return { success: true, data: postData };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch post";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on slug change
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);
      try {
        const postData = await PostService.getPost(slug);
        setPost(postData);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch post";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return {
    // State
    post,
    loading,
    error,

    // Actions
    fetchPost,
    refetch: fetchPost,
  };
}
