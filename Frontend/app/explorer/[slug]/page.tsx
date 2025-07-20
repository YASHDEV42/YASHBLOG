import { PostContent } from "./components/post-content";
// import { AuthorPosts } from "./components/author-posts";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <article className="container mx-auto px-4 py-8">
      <PostContent slug={slug} />
      {/* <AuthorPosts slug={slug} /> */}
    </article>
  );
}
