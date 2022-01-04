import { FoundDex } from '@quipuswap/sdk';

import { WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
