import { Button } from "@/components/ui/button";
import { CreatePostRequest } from "@/lib/hooks/posts/useCreatePost";

interface PostPreviewProps {
  postData: CreatePostRequest;
  onConfirm: () => void;
  onEdit: () => void;
  isLoading: boolean;
}

const PostPreview: React.FC<PostPreviewProps> = ({
  postData,
  onConfirm,
  onEdit,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{postData.title || "Untitled"}</h2>
      <p className="italic">{postData.excerpt || "No excerpt provided."}</p>
      <div
        className="editor max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.content || "" }}
      />
      <div className="flex justify-start gap-2">
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className={isLoading ? "cursor-not-allowed opacity-70" : ""}
        >
          {isLoading ? "Loading..." : "Confirm and Publish"}
        </Button>
        <Button onClick={onEdit} variant="secondary" disabled={isLoading}>
          Edit Post
        </Button>
      </div>
    </div>
  );
};

export default PostPreview;
