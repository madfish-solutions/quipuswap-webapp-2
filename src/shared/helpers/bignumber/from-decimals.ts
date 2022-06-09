import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

const BASE = 10;
const FALLBACK_DECIMALS = 0;

export const fromDecimals = (num: BigNumber, decimalsOrToken: Optional<number | Token>) =>
  num.div(
    new BigNumber(BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS
    )
  );
