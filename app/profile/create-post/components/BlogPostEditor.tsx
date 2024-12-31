"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "./TiptapEditor";
import TitleExcerptForm from "./TitleExcerptForm";
import PostPreview from "./PostPreview";

type PostData = {
  title: string;
  excerpt: string;
  content: string;
};

const BlogPostEditor = () => {
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<PostData>({
    title: "",
    excerpt: "",
    content: "",
  });

  const handleContentSave = (content: string) => {
    setPostData((prev) => ({ ...prev, content }));
    setStep(2);
  };

  const handleTitleExcerptSave = (title: string, excerpt: string) => {
    setPostData((prev) => ({ ...prev, title, excerpt }));
    setStep(3);
  };

  const handleConfirm = () => {
    // Here you would typically send the post data to your backend
    console.log("Post confirmed:", postData);
    // Reset the form after confirmation
    setPostData({ title: "", excerpt: "", content: "" });
    setStep(1);
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
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostEditor;
