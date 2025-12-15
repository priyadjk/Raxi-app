import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { MODEL_NAME } from "../constants";
import { Source } from "../types";

// Initialize Gemini
// NOTE: In a production environment, API calls should be proxied through a backend
// to protect the API Key. For this demo, we use the env variable directly.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onSources?: (sources: Source[]) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export interface ImageAttachment {
    data: string; // Base64
    mimeType: string;
}

let chatInstance: Chat | null = null;

export const resetChat = () => {
  chatInstance = null;
};

export const sendMessageStream = async (
  message: string,
  images: ImageAttachment[] | undefined,
  callbacks: StreamCallbacks
) => {
  try {
    // Lazy initialization of chat to persist context
    if (!chatInstance) {
      chatInstance = ai.chats.create({
        model: MODEL_NAME,
        config: {
          temperature: 0.7,
          // Enabling Google Search for grounding (Perplexity-like feature)
          tools: [{ googleSearch: {} }],
        },
      });
    }

    let msgParam: string | any[] = message;

    if (images && images.length > 0) {
        msgParam = [
            ...images.map(img => ({
                inlineData: {
                    mimeType: img.mimeType,
                    data: img.data
                }
            })),
            { text: message || " " } // Ensure there is text if passing parts
        ];
    }

    // @ts-ignore - The SDK definition might be strict about 'string' but it usually accepts Part[] at runtime for multimodal
    const result = await chatInstance.sendMessageStream({ message: msgParam });

    let fullText = '';

    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      
      // Extract Text
      const text = c.text;
      if (text) {
        fullText += text;
        callbacks.onChunk(text);
      }

      // Extract Grounding Metadata (Sources)
      // The API returns this in chunks, we look for them.
      const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        const sources: Source[] = [];
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || 'Web Source',
              uri: chunk.web.uri,
            });
          }
        });
        
        if (sources.length > 0) {
           // We might receive sources multiple times, usually at the end. 
           // We pass them up to be handled by the UI.
           if (callbacks.onSources) {
             callbacks.onSources(sources);
           }
        }
      }
    }

    callbacks.onComplete();

  } catch (error) {
    console.error("Gemini API Error:", error);
    callbacks.onError(error instanceof Error ? error : new Error("Unknown error"));
  }
};