import { FoundDex } from '@quipuswap/sdk';

import { Nullable, WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
