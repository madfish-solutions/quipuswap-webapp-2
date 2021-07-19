export const shortize = (str: string, length?: number) => `${str.slice(0, length ?? 4)}...${str.slice(-4)}`;
