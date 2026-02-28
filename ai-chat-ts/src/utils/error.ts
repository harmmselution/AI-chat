export interface AppError {
    message: string;
    status?: number;
  }
  
  const hasMessage = (error: unknown): error is { message: string } => {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    );
  };
  
  export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
  
    if (hasMessage(error)) {
      return error.message;
    }
  
    return "Something went wrong. Please try again.";
  };