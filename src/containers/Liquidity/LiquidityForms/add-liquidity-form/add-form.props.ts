import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Undefined, WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  transactionDuration: Undefined<BigNumber>;
  setTransactionDuration: (newDeadline?: BigNumber) => void;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
