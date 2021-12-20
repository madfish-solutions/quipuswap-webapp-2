import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface RemoveFormInterface {
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}
