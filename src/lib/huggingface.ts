import { HfInference } from "@huggingface/inference";

const globalForClients = global as unknown as {
  hf?: HfInference;
};

// Hugging Face Singleton
export const hf =
  globalForClients.hf || new HfInference(process.env.HUGGINGFACE_API_KEY!);

if (process.env.NODE_ENV !== "production") globalForClients.hf = hf;
