import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Token, TokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
  onChangeTokensPair: (tokensPair: TokenPair) => void;
}
