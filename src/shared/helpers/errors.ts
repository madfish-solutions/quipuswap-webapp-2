export const NOT_FOUND_MESSAGES = ['Cannot parse contract id', 'is invalid'];

export const isNotFoundError = (error: Error): boolean =>
  NOT_FOUND_MESSAGES.some(message => error.message.includes(message));
