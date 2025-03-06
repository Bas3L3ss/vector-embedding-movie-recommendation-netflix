"use server";
import { cache } from "@/lib/cache";
import { hf } from "../../lib/huggingface";
import { redis } from "@/lib/redis";

export async function generateEmbedding(text: string) {
  const response = await hf.featureExtraction({
    model: "intfloat/e5-large-v2",
    inputs: text,
    parameters: {},
    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
  });

  return response as number[]; // Returns embedding vector
}

// TODO: also apply redis
async function cachedEmbedding(query: string) {
  const cached = await redis.get(`embedding:${query}`);
  if (cached) {
    console.log("Embedding cache hit for:", query);
    return JSON.parse(cached);
  }

  console.log("No embedding cache for:", query);

  // Generate new embedding
  const queryVector = await generateEmbedding(query);

  // Store in Redis with expiration (e.g., 24 hours)
  await redis.setex(`embedding:${query}`, 86400, JSON.stringify(queryVector));

  return queryVector;
}
const getCachedEmbedding = (query: string) => {
  return cache(cachedEmbedding, ["query", query], {
    revalidate: false,
  })(query);
};
export async function generateCachedEmbedding(query: string) {
  return await getCachedEmbedding(query);
}
