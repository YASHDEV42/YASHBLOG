"use server";
import { CommentsWithUser } from "@/app/explorer/[slug]/page";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type PostData = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
};
const prisma = new PrismaClient();

export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading or trailing hyphens

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existingSlug = await prisma.post.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existingSlug) {
      break;
    }

    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const createPost = async (postData: PostData): Promise<void> => {
  console.log("Post data from the server action", postData);
  const title = postData.title;
  const content = postData.content;
  const excerpt = postData.excerpt;
  const id = postData.id;
  const slug = await generateUniqueSlug(title);

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        published: true,
        authorId: id as string,
        metadata: {
          create: {
            views: 0,
            likes: 0,
          },
        },
      },
    });
  } catch (error) {
    console.log("Error creating post", error);
    return;
  }
  console.log("Post created successfully");
};
export async function deletePost(id: string) {
  try {
    // Find the post and its relations
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        metadata: true,
        likes: true,
        comments: true,
        categories: true,
        tags: true,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    await prisma.$transaction([
      prisma.likedPosts.deleteMany({ where: { postId: id } }),
      prisma.comment.deleteMany({ where: { postId: id } }),
      prisma.categoryToPost.deleteMany({ where: { A: id } }),
      prisma.postToTag.deleteMany({ where: { A: id } }),
      prisma.postMetadata.delete({ where: { postId: id } }),
    ]);

    await prisma.post.delete({ where: { id } });

    revalidatePath("/profile");
    redirect("/profile");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post.");
  }
}
export async function updatePost(postData: PostData) {
  const { id, title, content, excerpt } = postData;
  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
      },
    });
    console.log("Post updated successfully");
  } catch (error) {
    console.log("Error updating post", error);
  }
  revalidatePath("/profile");
}

export async function togglePublishStatus(id: string) {
  console.log("This is the post id from the togglepublishstatus", id);

  const post = await prisma.post.findUnique({
    where: { id },
    select: { published: true },
  });

  if (post) {
    await prisma.post.update({
      where: { id },
      data: { published: !post.published },
    });
  }
  revalidatePath("/profile");
}
export async function likePost(postId: string, userId: string) {
  await prisma.$transaction(async (prisma) => {
    await prisma.likedPosts.create({
      data: {
        postId,
        userId,
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { metadata: true },
    });

    if (!post?.metadata) {
      await prisma.postMetadata.create({
        data: {
          postId,
          likes: 1,
          views: 1,
        },
      });
    } else {
      await prisma.postMetadata.update({
        where: { id: post.metadata.id },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
    }
  });

  revalidatePath("/profile");
}
export async function unlikePost(postId: string, userId: string) {
  await prisma.$transaction(async (prisma) => {
    await prisma.likedPosts.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { metadata: true },
    });

    if (post?.metadata) {
      await prisma.postMetadata.update({
        where: { id: post.metadata.id },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
    }
  });
  revalidatePath("/profile");
}
export async function increaseWatch(postId: string) {
  await prisma.postMetadata.upsert({
    where: { postId },
    update: {
      views: {
        increment: 1,
      },
    },
    create: {
      postId,
      views: 1,
      likes: 0,
    },
  });
}
type Data = {
  content: string;
  userId: string;
  postId: string;
};

export const createComment = async (
  data: Data
): Promise<CommentsWithUser | null> => {
  try {
    const createdComment = await prisma.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        userId: data.userId,
      },
      include: {
        user: true,
      },
    });

    console.log("Comment created successfully");
    return createdComment as CommentsWithUser;
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
};
