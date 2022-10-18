export const isNotFoundError = (error: Error): boolean => error.message.includes('Cannot parse contract id');
