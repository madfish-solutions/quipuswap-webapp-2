export const shortize = (str: string, length: number = 4) => {
  if (!str) return '';

  return `${str.slice(0, length)}...${str.slice(-length)}`;
};
