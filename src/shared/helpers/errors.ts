export const NOT_FOUND_MESSAGE = 'Cannot parse contract id';

export const isNotFoundError = (error: Error): boolean => error.message.includes(NOT_FOUND_MESSAGE);
