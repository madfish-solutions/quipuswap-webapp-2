import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Optional, Token, TokenPair } from '@shared/types';

export interface RemoveFormInterface {
  dex: Optional<FoundDex>;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
  onChangeTokensPair: (tokensPair: TokenPair) => void;
}
