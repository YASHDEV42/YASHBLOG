"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import TitleExcerptForm from "@/app/profile/create-post/components/TitleExcerptForm";
import PostPreview from "@/app/profile/create-post/components/PostPreview";
import { updatePost } from "@/actions/Posts";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type PostData = {
  title: string;
  excerpt: string;
  content: string;
};

const BlogPostEditor = ({
  id,
  initialData,
}: {
  id: string;
  initialData: PostData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<PostData>({
    title: initialData.title,
    excerpt: initialData.excerpt,
    content: initialData.content,
  });

  const handleContentSave = (content: string) => {
    setPostData((prev) => ({ ...prev, content }));
    setStep(2);
    toast.success("Content updated successfully");
  };

  const handleTitleExcerptSave = (title: string, excerpt: string) => {
    setPostData((prev) => ({ ...prev, title, excerpt }));
    setStep(3);
    toast.success("Title and excerpt updated successfully");
  };

  const handleConfirm = async () => {
    setLoading(true);
    const data = {
      id,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
    };

    toast.promise(updatePost(data), {
      loading: "Updating post...",
      success: () => {
        setLoading(false);
        setPostData({ title: "", excerpt: "", content: "" });
        setStep(1);
        return "Post updated successfully!";
      },
      error: (err) => {
        setLoading(false);
        return `Error updating post: ${err.message}`;
      },
    });
    redirect("/profile");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-20">
      <CardHeader>
        <CardTitle className="text-center lg:text-3xl md:text-2xl text-xl">
          Update Your Post <Edit className="inline ml-5 mb-1" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <TiptapEditor
            onSave={handleContentSave}
            initialContent={postData.content}
          />
        )}
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
