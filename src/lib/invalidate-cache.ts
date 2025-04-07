import { revalidateTag } from "next/cache";
import { redis } from "./redis";

export const invalidateFilmCache = async (
  tags: string[] = ["films"],
  redisKeys: string[] = [],
  redisPatterns: string[] = ["film:*", "films:*"]
): Promise<boolean> => {
  try {
    tags.forEach((tag) => revalidateTag(tag));
    console.log("Next.js cache invalidated for tags:", tags);

    if (redisKeys.length > 0) {
      await redis.del(...redisKeys);
      console.log("Redis cache invalidated for specific keys:", redisKeys);
    }

    for (const pattern of redisPatterns) {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          "100"
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await redis.del(...keys);
          console.log(
            `Redis cache invalidated for ${keys.length} keys matching pattern:`,
            pattern
          );
        }
      } while (cursor !== "0");
    }

    return true;
  } catch (error) {
    console.error("Error invalidating cache:", error);
    return false;
  }
};
