import BigNumber from 'bignumber.js';

const DOT_CHAR = '.';
const ZERO_CHAR = '0';

const ONE = 1;
const ZERO = 0;
export const removeExtraZeros = (value: string, decimals: number): string => {
  const fixedValue = new BigNumber(value).toFixed(decimals);

  const indexOfDot = fixedValue.indexOf(DOT_CHAR);

  let i = fixedValue.length - ONE;

  for (; i >= ZERO; i--) {
    if (fixedValue[i] === ZERO_CHAR) {
      continue;
    } else {
      break;
    }
  }

  const indexOfLastDigit = indexOfDot === i ? i : i + ONE;

  return fixedValue.slice(ZERO, indexOfLastDigit);
};
