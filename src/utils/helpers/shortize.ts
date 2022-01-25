const leftLenght = 7;
const rightLenght = 4;

export const shortize = (str: string, length?: number) => {
  if (!str) {
    return '';
  }

  const wrapLeftLenght = length ?? leftLenght;
  const wrapRightLenght = length ?? rightLenght;

  return `${str.slice(0, wrapLeftLenght)}...${str.slice(-wrapRightLenght)}`;
};
