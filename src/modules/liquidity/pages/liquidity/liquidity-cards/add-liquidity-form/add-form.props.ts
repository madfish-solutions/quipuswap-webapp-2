import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Optional, Token } from '@shared/types';

export interface AddFormInterface {
  dex: Optional<FoundDex>;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
  tokenALoading: boolean;
  tokenBLoading: boolean;
  onTokenAChange: (token: Token) => void;
  onTokenBChange: (token: Token) => void;
}
