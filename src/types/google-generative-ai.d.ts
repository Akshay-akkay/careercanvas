declare module "@google/generative-ai" {
  /** Options used when selecting a model */
  export interface ModelOptions {
    model: string;
  }

  /** The response wrapper returned by generateContent() */
  export interface ContentResponse {
    text(): string;
  }

  /** Result object returned by generateContent() */
  export interface GenerateContentResult {
    response: ContentResponse;
  }

  /** Represents a generative model instance */
  export interface GenerativeModel {
    generateContent(prompt: string): Promise<GenerateContentResult>;
  }

  /** Entry-point class for interacting with Google Generative AI */
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(options: ModelOptions): GenerativeModel;
  }
} 