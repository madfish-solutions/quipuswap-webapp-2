import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Token } from '@utils/types';

export interface AddFormInterface {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
  tokenALoading: boolean;
  tokenBLoading: boolean;
  onTokenAChange: (token: Token) => void;
  onTokenBChange: (token: Token) => void;
}
