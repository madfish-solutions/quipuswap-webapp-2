import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Undefined, WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  deadline: Undefined<BigNumber>;
  setDeadline: (newDeadline?: BigNumber) => void;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
