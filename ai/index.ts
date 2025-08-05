import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

// Create Google AI instance with API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
});

// Using model names for @ai-sdk/google v2.x
// Using flash model which has higher free tier limits
export const geminiProModel = google("gemini-1.5-flash");
export const geminiFlashModel = google("gemini-1.5-flash");
