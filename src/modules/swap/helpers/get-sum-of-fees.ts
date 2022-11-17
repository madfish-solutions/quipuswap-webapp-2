import { BigNumber } from 'bignumber.js';

import { DEFAULT_DECIMALS } from '@config/constants';
import { getSumOfNumbers } from '@shared/helpers';

import { RouteFees } from '../types';

export const getSumOfFees = (feesAndSlug: Array<RouteFees>) => {
  const sumOfFees = getSumOfNumbers(feesAndSlug.map(({ fee }) => fee)).decimalPlaces(
    DEFAULT_DECIMALS,
    BigNumber.ROUND_DOWN
  );

  const sumOfDevFees = getSumOfNumbers(feesAndSlug.map(({ devFee }) => devFee)).decimalPlaces(
    DEFAULT_DECIMALS,
    BigNumber.ROUND_DOWN
  );

  const sumOfTotalFees = sumOfFees.plus(sumOfDevFees);

  return { sumOfFees, sumOfDevFees, sumOfTotalFees };
};
