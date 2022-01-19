import { Dispatch, SetStateAction } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Nullable, WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
  transactionDuration: BigNumber;
  setTransactionDuration: Dispatch<SetStateAction<BigNumber>>;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
