import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// We named this function "GET", because we need a GET endpoint on our server.
export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    // This pageSize = 10 means, every time we send a request to the server it sends back only 10 posts.
    const pageSize = 10;
    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

    const data: PostsPage = {
      posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    // This {status: 500} is an HTTP error response.
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
