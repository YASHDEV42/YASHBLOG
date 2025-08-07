import BlogPostEditor from "./components/BlogPostEditor";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <ProtectedRoute>
      <BlogPostEditor slug={slug} />
    </ProtectedRoute>
  );
}
