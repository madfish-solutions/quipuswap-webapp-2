import BigNumber from 'bignumber.js';

export const parseDecimals = (value: string, min: number, max: number, decimals?: number) => {
  // leave only numbers
  if (value === '.') {
    return '0.';
  }
  let val = value
    .replace(/ /g, '') // removes empty spaces
    .replace(/,/g, '.') // changes , to .
    .replace(/[.]+/g, '.') // changes multidots ... to signle dot .
    .replace(/[^0-9.]+/g, '') // removes all symbols, that not numbers or dot
    .replace(/^0+(?=\d)/, ''); // removes leading zeros
  const match = val.match(/[.]/g) || [];
  if (match.length > 1) {
    val = val.replace('.', '');
  }
  const indexOfDot = val.indexOf('.');
  const symbolsAfterDot = val.length - 1 - indexOfDot;
  if (decimals && indexOfDot !== -1 && val.length - indexOfDot > decimals + 1) {
    val = val.substring(0, indexOfDot + decimals + 1);
  }
  if (val === '') return '';
  let res = val;
  if (new BigNumber(val).lt(new BigNumber(min))) {
    res = min.toString();
  }
  if (new BigNumber(val).gt(new BigNumber(max))) {
    res = max.toString();
  }
  if (indexOfDot && !symbolsAfterDot) return res;
  return new BigNumber(res).toFixed();
};
