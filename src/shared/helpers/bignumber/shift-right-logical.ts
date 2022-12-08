import BigNumber from 'bignumber.js';

const BINARY_BASE = 2;

/**
 * A replacement of `>>` operator for `BigNumber` that works as if number size was infinite.
 * @param value the value to be shifted
 * @param bits the amount of bits to shift by
 * @returns The result of shifting `value` right by `bits` bits.
 */
export const shiftRightLogical = (value: BigNumber, bits: BigNumber.Value) => {
  return value.dividedToIntegerBy(new BigNumber(BINARY_BASE).pow(bits));
};
