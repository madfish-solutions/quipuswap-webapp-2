export const NOT_FOUND_MESSAGES = ['Cannot parse contract id', 'is invalid', '404'];

export const isNotFoundError = (error: string | Error): boolean =>
  NOT_FOUND_MESSAGES.some(message => (error instanceof Error ? error.message : error).includes(message));
