import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

const DECIMALS_BASE = 10;
const FALLBACK_DECIMALS = 0;

export const toDecimals = (num: BigNumber, decimalsOrToken: Optional<number | Token>): BigNumber =>
  num.times(
    new BigNumber(DECIMALS_BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS
    )
  );
