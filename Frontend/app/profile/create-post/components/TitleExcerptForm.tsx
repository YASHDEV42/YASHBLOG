"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TitleExcerptFormProps {
  onSave: (title: string, excerpt: string) => void;
  initialTitle: string;
  initialExcerpt: string;
}

const TitleExcerptForm: React.FC<TitleExcerptFormProps> = ({
  onSave,
  initialTitle,
  initialExcerpt,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, excerpt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Next: Preview Post
      </Button>
    </form>
  );
};

export default TitleExcerptForm;
