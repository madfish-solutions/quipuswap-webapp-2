import { BigNumber } from 'bignumber.js';

import { CONTRACT_DECIMALS_PRECISION_POWER, PERCENT } from '@config/constants';
import { isEqual, isNull } from '@shared/helpers';

const CARRET_POSITION_SHIFT = 1;

export const setCarretPosition = (input: Nullable<HTMLInputElement>) => {
  if (isNull(input)) {
    return;
  }

  const selectionStart = input.selectionStart;

  if (!input.value.includes(PERCENT)) {
    input.value = `${input.value}${PERCENT}`;
  }

  if (isEqual(selectionStart, input.value.length - CARRET_POSITION_SHIFT)) {
    input.setSelectionRange(selectionStart, selectionStart);
  }
};

// 10^18 / 10^decimals == 10^(18-decimals)
export const getPrecisionMultiplier = (decimals: number) =>
  new BigNumber(10).pow(new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER).minus(decimals));

// 10^(18+18 - decimals)
export const getPrecisionRate = (decimals: number) =>
  new BigNumber(10).pow(
    new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER)
      .plus(new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER))
      .minus(decimals)
  );
