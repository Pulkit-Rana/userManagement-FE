export function handleApiError(error: unknown, fallbackMessage = 'Something went wrong') {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return fallbackMessage;
}