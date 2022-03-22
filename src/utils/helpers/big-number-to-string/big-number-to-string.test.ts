import { BigNumber } from 'bignumber.js';

import { bigNumberToString } from './big-number-to-string';

describe('bigNumberToString', () => {
  test('Should_Return0_When_BigNumberIsZero', () => {
    expect(bigNumberToString(new BigNumber(0))).toBe('0');
  });
  test('Should_ReturnCorrectValue_When_BigNumberIsInt', () => {
    expect(bigNumberToString(new BigNumber(123))).toBe('123');
  });
  test('Should_ReturnCorrectValue_When_BigNumberIsFloat', () => {
    expect(bigNumberToString(new BigNumber(123.123))).toBe('123.123');
  });
});
