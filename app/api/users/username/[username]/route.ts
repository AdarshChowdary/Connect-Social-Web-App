import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUser.id),
    });

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json(user);
  } catch (error) {
    console.error(error);
    // This {status: 500} is an HTTP error response.
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
