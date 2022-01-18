import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
  transactionDuration: BigNumber;
  setTransactionDuration: (newDeadline: BigNumber) => void;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
