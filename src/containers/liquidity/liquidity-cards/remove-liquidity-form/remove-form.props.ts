import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Optional, RawToken, TokenPair } from '@interfaces/types';

export interface RemoveFormInterface {
  dex: Optional<FoundDex>;
  tokenA: Nullable<RawToken>;
  tokenB: Nullable<RawToken>;
  onChangeTokensPair: (tokensPair: TokenPair) => void;
}
