import { BigNumber } from 'bignumber.js';

import { bigNumberToString } from './big-number-to-string';

const valueForTesting = 123;

test('Testing bigmunberToString function', () => {
  const valueForTestingBN = new BigNumber(valueForTesting);

  expect(bigNumberToString(valueForTestingBN)).toBe('123');
});
