"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import TitleExcerptForm from "./TitleExcerptForm";
import PostPreview from "./PostPreview";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import { useCreatePost } from "@/lib/hooks/posts/useCreatePost";
import { CreatePostRequest } from "@/lib/hooks/posts/useCreatePost";

const BlogPostEditor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<CreatePostRequest>({
    title: "",
    excerpt: "",
    content: "",
    categories: [],
    published: false,
  });
  const { mutate: createPost } = useCreatePost();
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

    createPost(
      {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        published: true,
      },
      {
        onSuccess: () => {
          toast.success("✅ Post created successfully!");
          setPostData({
            title: "",
            excerpt: "",
            content: "",
            categories: [],
            published: false,
          });
          setStep(1);
          router.push("/profile");
        },
        onError: () => {
          toast.error("❌ Failed to create post");
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
