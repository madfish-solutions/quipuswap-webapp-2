import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface LiquidityTokenInfo {
  token: Token;
  atomicTokenTvl: BigNumber;
}
