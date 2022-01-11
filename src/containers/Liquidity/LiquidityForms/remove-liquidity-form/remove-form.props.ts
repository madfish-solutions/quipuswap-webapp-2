import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  transactionDuration: BigNumber;
  setTransactionDuration: (newDeadline: BigNumber) => void;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
