export interface HFResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  error?: string;
}

export interface HFStreamChunk {
  choices?: Array<{
    delta?: {
      role?: "assistant";
      content?: string;
    };
    finish_reason?: string | null;
  }>;
  error?: string;
}
