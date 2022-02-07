import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Optional, WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  dex: Optional<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
  tokenALoading: boolean;
  tokenBLoading: boolean;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
