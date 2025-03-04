"use server";
import { hf } from "@/lib/huggingface";
// import { redis } from "@/lib/redis";

export async function generateEmbedding(text: string) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Missing Hugging Face API Key");
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }), // Send a string, not an array
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API Error: ${response.statusText}`);
    }

    return await response.json(); // Return the embeddings
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
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
