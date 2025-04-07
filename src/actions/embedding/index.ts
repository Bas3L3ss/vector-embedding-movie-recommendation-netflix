"use server";
import { hf } from "../../lib/huggingface";
import { redis } from "@/lib/redis";

export async function generateEmbedding(
  text: string
): Promise<number[] | null> {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 45000; // 45 seconds

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Request timed out after 30 seconds")),
          TIMEOUT_MS
        );
      });

      // Race the actual request against the timeout
      const response = await Promise.race([
        hf.featureExtraction({
          model: "intfloat/e5-large-v2",
          inputs: text,
          parameters: {},
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
        }),
        timeoutPromise,
      ]);
      console.log("done generating embedding");

      return response as number[]; // Returns embedding vector
    } catch (error) {
      retries++;
      console.log(`Attempt ${retries} failed:`, error);

      if (retries >= MAX_RETRIES) {
        console.log(`All ${MAX_RETRIES} attempts failed. Giving up.`);
        return null;
      }

      // Optional: add exponential backoff for retries
      const backoffTime = Math.min(1000 * Math.pow(2, retries), 8000);
      console.log(`Retrying in ${backoffTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }

  return null; // This should never be reached due to the return in the if condition above
}

export async function generateCachedEmbedding(query: string) {
  const cached = await redis.get(`embedding:${query}`);
  if (cached && cached != null) {
    console.log("Embedding cache hit for:", query);
    return JSON.parse(cached);
  }

  console.log("No embedding cache for:", query);

  // Generate new embedding
  const queryVector = await generateEmbedding(query);

  // Store in Redis with expiration (e.g., 24 hours)
  await redis.setex(`embedding:${query}`, 86400, JSON.stringify(queryVector));
  console.log("cached", query);

  return queryVector;
}
