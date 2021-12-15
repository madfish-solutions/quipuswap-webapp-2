export const shortize = (str: string, length = 4) => {
  if (!str) {
    return '';
  }

  return `${str.slice(0, length)}...${str.slice(-length)}`;
};
