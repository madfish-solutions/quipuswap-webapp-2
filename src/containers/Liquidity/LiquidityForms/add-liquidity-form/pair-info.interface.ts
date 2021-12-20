import BigNumber from 'bignumber.js';

import { Nullable, WhitelistedToken } from '@utils/types';

export interface PairInfo {
  id: Nullable<BigNumber>;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  totalSupply: BigNumber;
  tokenAPool: BigNumber;
  tokenBPool: BigNumber;
}
