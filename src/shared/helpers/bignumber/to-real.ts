import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

const FALLBACK_DECIMALS = 0;

export const toReal = (atomic: BigNumber, decimalsOrToken: Optional<number | Token>) =>
  atomic.shiftedBy(
    -(typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS)
  );
