import { FoundDex } from '@quipuswap/sdk';

import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
