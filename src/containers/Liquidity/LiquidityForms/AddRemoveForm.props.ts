import { WhitelistedToken } from '@utils/types';

export interface AddRemoveFormInterface {
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
