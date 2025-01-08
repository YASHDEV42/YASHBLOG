"use client";

import { useState, useMemo, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogCard } from "./blog-card";
import { PostData } from "../page";

const filters = ["All", "Trending", "Most Likes", "Newest"];

export function Explorer({ posts }: { posts: PostData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredPosts = useMemo(() => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<p>Loading posts...</p>}>
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
