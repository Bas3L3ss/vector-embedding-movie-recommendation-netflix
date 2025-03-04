"use server";
import { hf } from "@/lib/huggingface";
// import { redis } from "@/lib/redis";

export async function generateEmbedding(text: string) {
  const response = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
    parameters: {},
    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
  });

  return response as number[]; // Returns embedding vector
}

export async function generateCachedEmbedding(
  query: string
): Promise<number[]> {
  let queryVector: number[] | null = null;
  // TODO: add caching
  // const cached = await redis.get(`query:${query}`);

  // if (cached) {
  //   try {
  //     queryVector = JSON.parse(cached) as number[];
  //   } catch (error) {
  //     console.error("Failed to parse cached embedding:", error);
  //   }
  // }

  // if (!queryVector) {
  queryVector = await generateEmbedding(query);
  // await redis.set(`query:${query}`, JSON.stringify(queryVector), "EX", 3600); // Cache for 1 hour
  // }

  return queryVector;
}
