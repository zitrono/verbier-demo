import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

// Try using model ID without any prefix for @ai-sdk/google v0.0.51
export const geminiProModel = google("gemini-1.0-pro");
export const geminiFlashModel = google("gemini-1.5-flash-latest");
