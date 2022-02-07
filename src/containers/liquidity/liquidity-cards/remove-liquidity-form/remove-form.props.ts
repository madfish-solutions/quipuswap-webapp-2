import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Optional, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: Optional<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
