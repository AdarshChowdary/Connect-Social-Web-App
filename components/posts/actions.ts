"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("UnAuthorized");

  const oldPost = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!oldPost) throw new Error("Post not found.");
  if (oldPost.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: {
      id: id,
    },
    include: getPostDataInclude(user.id),
  });

  return deletedPost;
}
