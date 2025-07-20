"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import TitleExcerptForm from "./TitleExcerptForm";
import PostPreview from "./PostPreview";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePosts } from "@/lib/hooks/use-posts";
import { useAuth } from "@/lib/hooks/use-auth";
type PostData = {
  title: string;
  excerpt: string;
  content: string;
};

const BlogPostEditor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<PostData>({
    title: "",
    excerpt: "",
    content: "",
  });
  const { createPost } = usePosts();
  const { user } = useAuth();
  const router = useRouter();

  const handleContentSave = (content: string) => {
    setPostData((prev) => ({ ...prev, content }));
    setStep(2);
    toast.success("Content created successfully");
  };

  const handleTitleExcerptSave = (title: string, excerpt: string) => {
    setPostData((prev) => ({ ...prev, title, excerpt }));
    setStep(3);
    toast.success("Title and excerpt created successfully");
  };

  const handleConfirm = async () => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }

    setLoading(true);

    try {
      // Create the post data that matches the API expectation
      const data = {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        published: true, // You can make this configurable
      };

      const result = await createPost(data);

      if (result.success) {
        toast.success("Post created successfully");
        setPostData({ title: "", excerpt: "", content: "" });
        setStep(1);
        router.push("/profile");
      } else {
        toast.error(result.message || "Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-16">
      <CardHeader>
        <CardTitle className="text-center lg:text-3xl md:text-2xl text-xl">
          Create and Share with Ease
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && <TiptapEditor onSave={handleContentSave} />}
        {step === 2 && (
          <TitleExcerptForm
            onSave={handleTitleExcerptSave}
            initialTitle={postData.title}
            initialExcerpt={postData.excerpt}
          />
        )}
        {step === 3 && (
          <PostPreview
            postData={postData}
            onConfirm={handleConfirm}
            onEdit={() => setStep(1)}
            isLoading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostEditor;
