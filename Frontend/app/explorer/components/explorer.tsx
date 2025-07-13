"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogCard } from "./blog-card";
import { usePosts } from "@/lib/hooks/use-posts";
import { Post } from "@/types";

const filters = ["All", "Trending", "Most Likes", "Newest"];

export function Explorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { posts, loading, error, fetchPosts } = usePosts();

  useEffect(() => {
    const loadPosts = async () => {
      const result = await fetchPosts();
      if (!result.success) {
        console.error("Failed to fetch posts:", result.message);
      }
    };
    loadPosts();
  }, []);

  const filteredPosts: Post[] = useMemo(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (selectedFilter) {
      case "Trending":
        return [...filtered]
          .map((post) => ({
            ...post,
            score:
              (post.metadata?.likes || 0) * 2 + (post.metadata?.views || 0),
          }))
          .sort((a, b) => b.score - a.score);

      case "Most Likes":
        return [...filtered].sort(
          (a, b) => (b.metadata?.likes || 0) - (a.metadata?.likes || 0)
        );
      case "Newest":
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "All":
      default:
        return filtered;
    }
  }, [searchTerm, selectedFilter, posts]);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-500">Loading posts...</p>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-red-500">Error: {error}</p>
        <button
          onClick={() => {
            const loadPosts = async () => {
              await fetchPosts();
            };
            loadPosts();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Helper function to render posts or no-posts message
  const renderPostsOrMessage = () => {
    if (filteredPosts.length === 0 && searchTerm) {
      return (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-500">
            No posts found matching {searchTerm}
          </p>
        </div>
      );
    } else if (filteredPosts.length === 0) {
      return (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-500">No posts available.</p>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
      <Suspense fallback={<p>Loading posts...</p>}>
        {renderPostsOrMessage()}
      </Suspense>
    </div>
  );
}
