import BigNumber from 'bignumber.js';

export function clamp(value: number, minValue: number, maxValue: number): number;
export function clamp(value: BigNumber, minValue: BigNumber.Value, maxValue: BigNumber.Value): BigNumber;
export function clamp(value: BigNumber | number, minValue: BigNumber.Value, maxValue: BigNumber.Value) {
  const result = BigNumber.minimum(maxValue, BigNumber.maximum(minValue, value));

  return typeof value === 'number' ? result.toNumber() : result;
}
