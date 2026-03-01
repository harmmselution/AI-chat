export interface AppError {
  message: string;
  status?: number;
}

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

const isAppError = (error: unknown): error is AppError =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof (error as { message: unknown }).message === "string" &&
  (!("status" in error) ||
    typeof (error as { status?: unknown }).status === "number");

 const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (isAppError(error)) {
    return error.status != null
      ? `${error.message} (HTTP ${error.status})`
      : error.message;
  }

  return FALLBACK_MESSAGE;
};

export {getErrorMessage}