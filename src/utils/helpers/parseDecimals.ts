import BigNumber from 'bignumber.js';

export const parseDecimals = (value: string, min: number, max: number, decimals?:number) => {
  // leave only numbers
  let val = value.replace(/ /g, '').replace(/,/g, '.').replace(/[^0-9.]+/g, '');
  const match = (val.match(/[.]/g) || []);
  if (val.endsWith('.') && match.length > 1) {
    val = val.slice(0, -1);
  }
  let numVal = new BigNumber(val || 0);
  const indexOfDot = val.indexOf('.');
  if (decimals && indexOfDot !== -1 && val.length - indexOfDot > decimals + 1) {
    val = val.substring(0, indexOfDot + decimals + 1);
    numVal = new BigNumber(val);
  }
  let onlyNums = val;
  if (val.endsWith('.') && match.length > 1) {
    onlyNums = numVal.toString();
  }
  if (onlyNums === '') return '';
  let res = onlyNums;
  if (new BigNumber(onlyNums).lt(new BigNumber(min))) {
    res = min.toString();
  }
  if (new BigNumber(onlyNums).gt(new BigNumber(max))) {
    res = max.toString();
  }
  return res;
};
