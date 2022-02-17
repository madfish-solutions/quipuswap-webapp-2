import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Optional, RawToken } from '@interfaces/types';

export interface AddFormInterface {
  dex: Optional<FoundDex>;
  tokenA: Nullable<RawToken>;
  tokenB: Nullable<RawToken>;
  tokenALoading: boolean;
  tokenBLoading: boolean;
  onTokenAChange: (token: RawToken) => void;
  onTokenBChange: (token: RawToken) => void;
}
