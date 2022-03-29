const DEFAULT_LENGTH = 4;
const FIRST_INDEX = 0;

export const shortize = (str: string, length = DEFAULT_LENGTH) => {
  if (!str) {
    return '';
  }

  return `${str.slice(FIRST_INDEX, length)}...${str.slice(-length)}`;
};
