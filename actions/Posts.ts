"use server";
import { PrismaClient } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

type PostData = {
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

const createPost = async (postData: PostData, user: User): Promise<void> => {
  console.log("Post data from the server action", postData);
  const title = postData.title;
  const content = postData.content;
  const excerpt = postData.excerpt;
  const slug = await generateUniqueSlug(title);
  try {
    await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        published: true,
        authorId: user.id,
      },
    });
  } catch (error) {
    console.log("Error creating post", error);
    return;
  }
  console.log("Post created successfully");
};
export async function deletePost(id: number) {
  await prisma.post.delete({
    where: { id },
  });
  revalidatePath("/profile");
}

export async function togglePublishStatus(id: number) {
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

export { createPost };