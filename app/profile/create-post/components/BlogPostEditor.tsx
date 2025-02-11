"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import TitleExcerptForm from "./TitleExcerptForm";
import PostPreview from "./PostPreview";
import { createPost } from "@/actions/Posts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type PostData = {
  title: string;
  excerpt: string;
  content: string;
};

const BlogPostEditor = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<PostData>({
    title: "",
    excerpt: "",
    content: "",
  });
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
    setLoading(true);
    const data = {
      id,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
    };
    toast.promise(createPost(data), {
      loading: "Creating post...",
      success: () => {
        setLoading(false);
        setPostData({ title: "", excerpt: "", content: "" });
        setStep(1);
        return "Post created successfully";
      },
      error: () => {
        setLoading(false);
        return "Error creating post";
      },
    });
    setLoading(false);
    setPostData({ title: "", excerpt: "", content: "" });
    setStep(1);
    router.push("/profile");
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
