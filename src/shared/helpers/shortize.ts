const LEFT_LENGTH = 7;
const RIGHT_LENGTH = 4;
const FISRT_INDEX = 0;
export const shortize = (str: string, length?: number) => {
  if (!str) {
    return '';
  }

  const wrapLeftLenght = length ?? LEFT_LENGTH;
  const wrapRightLenght = length ?? RIGHT_LENGTH;

  return `${str.slice(FISRT_INDEX, wrapLeftLenght)}...${str.slice(-wrapRightLenght)}`;
};
