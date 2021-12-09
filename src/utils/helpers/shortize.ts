export const shortize = (str: string, length: number = 4) => `${str.slice(0, length)}...${str.slice(-length)}`;
