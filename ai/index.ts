import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

// Using correct model naming for @ai-sdk/google v0.0.51
export const geminiProModel = google("gemini-pro");
export const geminiFlashModel = google("gemini-1.5-flash");
