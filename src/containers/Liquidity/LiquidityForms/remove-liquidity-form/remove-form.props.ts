import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Undefined, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  transactionDuration: Undefined<BigNumber>;
  setTransactionDuration: (newDeadline?: BigNumber) => void;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
