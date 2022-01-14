import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  transactionDuration: BigNumber;
  setTransactionDuration: (newDeadline: BigNumber) => void;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
