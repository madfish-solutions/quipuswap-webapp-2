import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

const DECIMALS_BASE = 10;
const FALLBACK_DECIMALS = 0;

export const toAtomic = (real: BigNumber, decimalsOrToken: Optional<number | Token>): BigNumber =>
  real.times(
    new BigNumber(DECIMALS_BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS
    )
  );
