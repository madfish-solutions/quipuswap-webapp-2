/* eslint-disable @typescript-eslint/no-magic-numbers */
import { expect } from '@jest/globals';
import { BigNumber } from 'bignumber.js';

import { isNull } from '../type-checks';
import { numberAsString } from './number-as-string';

const testCaseList = [
  {
    value: '0.00',
    expectString: '0.00',
    expectBigNumber: new BigNumber(0),
    decimals: 6
  },
  {
    value: '0.000000001',
    expectString: '0.000001',
    expectBigNumber: new BigNumber(0.000001),
    decimals: 6
  },
  {
    value: '0,00',
    expectString: '0.00',
    expectBigNumber: new BigNumber(0),
    decimals: 6
  },
  {
    value: '0,000000001',
    expectString: '0.000001',
    expectBigNumber: new BigNumber(0.000001),
    decimals: 6
  },
  {
    value: '0.',
    expectString: '0.',
    expectBigNumber: new BigNumber(0),
    decimals: 6
  },
  {
    value: '1.',
    expectString: '1.',
    expectBigNumber: new BigNumber(1),
    decimals: 6
  },
  {
    value: '0,',
    expectString: '0.',
    expectBigNumber: new BigNumber(0),
    decimals: 6
  },
  {
    value: '1,',
    expectString: '1.',
    expectBigNumber: new BigNumber(1),
    decimals: 6
  },
  {
    value: '',
    expectString: '',
    expectBigNumber: null,
    decimals: 6
  },
  {
    value: '123.3',
    expectString: '123',
    expectBigNumber: new BigNumber(123),
    decimals: 0
  },
  {
    value: '123.35432323',
    expectString: '123.354',
    expectBigNumber: new BigNumber(123.354),
    decimals: 3
  },
  {
    value: '0,15,1515,151515',
    expectString: '0.1515',
    expectBigNumber: new BigNumber(0.1515),
    decimals: 4
  },
  {
    value: '0,3543.2323',
    expectString: '0.354323',
    expectBigNumber: new BigNumber(0.354323),
    decimals: 6
  }
];

describe('numberAsString', () => {
  testCaseList.forEach(({ value, expectString, expectBigNumber, decimals }) => {
    test(`Value "${value}" should be "${expectString}", bignumber equivalent should be ${
      isNull(expectBigNumber) ? null : expectBigNumber.toFixed()
    }`, () => {
      const { realValue, fixedValue } = numberAsString(value, decimals);

      expect(realValue).toBe(expectString);

      if (isNull(expectBigNumber)) {
        expect(fixedValue).toBeNull();
      } else {
        expect(fixedValue?.isEqualTo(expectBigNumber)).toBeTruthy();
      }
    });
  });
});
