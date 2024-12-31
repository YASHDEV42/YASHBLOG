import { Button } from "@/components/ui/button";

interface PostPreviewProps {
  postData: {
    title: string;
    excerpt: string;
    content: string;
  };
  onConfirm: () => void;
  onEdit: () => void;
}

const PostPreview: React.FC<PostPreviewProps> = ({
  postData,
  onConfirm,
  onEdit,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{postData.title}</h2>
      <p className="italic">{postData.excerpt}</p>
      <div
        className="editor max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.content }}
      />
      <div className="flex justify-between">
        <Button onClick={onEdit}>Edit Post</Button>
        <Button onClick={onConfirm}>Confirm and Publish</Button>
      </div>
    </div>
  );
};

export default PostPreview;
