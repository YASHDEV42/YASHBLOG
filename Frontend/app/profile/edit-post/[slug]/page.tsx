import BlogPostEditor from "./components/BlogPostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostEditor slug={slug} />;
}
