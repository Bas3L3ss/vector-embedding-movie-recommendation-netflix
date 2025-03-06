"use server";
import { cache } from "@/lib/cache";
import { hf } from "../../lib/huggingface";

export async function generateEmbedding(text: string) {
  const response = await hf.featureExtraction({
    model: "sentence-transformers/all-mpnet-base-v2",
    inputs: text,
    parameters: {},
    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
  });

  return response as number[]; // Returns embedding vector
}

async function cachedEmbedding(query: string) {
  console.log("no embedding cache for ", query);

  let queryVector: number[] | null = null;

  queryVector = await generateEmbedding(query);

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
