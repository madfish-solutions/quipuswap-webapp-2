import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Nullable, WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  transactionDuration: Nullable<BigNumber>;
  setTransactionDuration: (newDeadline: Nullable<BigNumber>) => void;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
