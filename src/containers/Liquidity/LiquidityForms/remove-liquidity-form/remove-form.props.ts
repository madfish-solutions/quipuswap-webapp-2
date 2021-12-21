import { FoundDex } from '@quipuswap/sdk';

import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
