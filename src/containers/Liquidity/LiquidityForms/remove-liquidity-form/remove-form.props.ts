import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  transactionDuration: Nullable<BigNumber>;
  setTransactionDuration: (newDeadline: Nullable<BigNumber>) => void;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
