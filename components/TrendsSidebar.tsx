import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });
  return (
    <div className="space-y-5 rounded-lg border-[1px] bg-card p-5 shadow-sm">
      <div className="text-lg font-bold">Who To Follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar
                avatarUrl={user.avatarUrl}
                size={40}
                className="flex-none"
              />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.username}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.displayName}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

// The unstable_cache is a next.js method, which helps us in storing the cache in server.
const getTrendingTopics = unstable_cache(
  async () => {
    // For counting the hashtags using orm like prisma, we need to write a normal SQL Query using "prisma.queryRaw()".
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
  SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
  `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      // Since we can't send a bigint between server and client components, we convert it into a number.
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-lg border-[1px] bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];
        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
