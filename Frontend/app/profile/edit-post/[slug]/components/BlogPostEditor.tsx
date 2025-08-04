"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import TitleExcerptForm from "@/app/profile/create-post/components/TitleExcerptForm";
import PostPreview from "@/app/profile/create-post/components/PostPreview";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Fixed: Use useRouter instead of redirect
import { usePost } from "@/lib/hooks/posts/usePost";
import { useUpdatePost } from "@/lib/hooks/posts/useUpdatePost";
import Spinner from "@/components/Spinner";

const BlogPostEditor = ({ slug }: { slug: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState({
    title: "",
    excerpt: "",
    content: "",
  });

  const { data: post, isLoading, error } = usePost(slug);
  const { mutate: updatePost } = useUpdatePost();
  const router = useRouter();

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
      });
    }
  }, [post]);

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
    if (!post) {
      toast.error("Post not found");
      return;
    }

    setLoading(true);

    const updateData = {
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
    };

    updatePost(
      { slug: post.slug, data: updateData }, // Pass both slug and data
      {
        onSuccess: () => {
          setLoading(false);
          toast.success("Post updated successfully!");
          router.push("/profile"); // Navigate after success
        },
        onError: (error) => {
          setLoading(false);
          console.error("Error updating post:", error);
          toast.error(
            `Error updating post: ${error.message || "Unknown error"}`
          );
        },
      }
    );
  };

  const handleEdit = () => {
    setStep(1);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto my-20 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-20">
        <CardContent className="text-center py-10">
          <p className="text-red-500 mb-4">
            Error loading post: {error.message || error.toString()}
          </p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </CardContent>
      </Card>
    );
  }

  if (!post) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-20">
        <CardContent className="text-center py-10">
          <p className="text-gray-500">Post not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-20">
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
            postData={{
              ...postData,
              categories: post.categories || [],
              published: post.published || false,
            }}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
            isLoading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostEditor;
