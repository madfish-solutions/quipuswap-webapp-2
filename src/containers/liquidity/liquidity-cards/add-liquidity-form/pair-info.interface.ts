import BigNumber from 'bignumber.js';

import { Nullable, Token } from '@utils/types';

export interface PairInfo {
  id: Nullable<BigNumber>;
  tokenA: Token;
  tokenB: Token;
  totalSupply: BigNumber;
  tokenAPool: BigNumber;
  tokenBPool: BigNumber;
}
