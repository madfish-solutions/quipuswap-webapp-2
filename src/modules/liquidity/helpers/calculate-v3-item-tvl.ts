import BigNumber from 'bignumber.js';

import { isExist } from '@shared/helpers';
import { Optional } from '@shared/types';

export const calculateV3ItemTvl = (
  tokenXBalance: BigNumber,
  tokenYBalance: BigNumber,
  tokenXExchangeRate: Optional<BigNumber>,
  tokenYExchangeRate: Optional<BigNumber>
) =>
  isExist(tokenXExchangeRate) && isExist(tokenYExchangeRate)
    ? tokenXBalance.multipliedBy(tokenXExchangeRate).plus(tokenYBalance.multipliedBy(tokenYExchangeRate))
    : null;
