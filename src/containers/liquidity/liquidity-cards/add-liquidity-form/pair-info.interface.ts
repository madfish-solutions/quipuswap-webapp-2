import BigNumber from 'bignumber.js';

import { Nullable, RawToken } from '@interfaces/types';

export interface PairInfo {
  id: Nullable<BigNumber>;
  tokenA: RawToken;
  tokenB: RawToken;
  totalSupply: BigNumber;
  tokenAPool: BigNumber;
  tokenBPool: BigNumber;
}
