import { WhitelistedToken } from '@utils/types';

export interface AddFormInterface {
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  onTokenAChange: (token: WhitelistedToken) => void;
  onTokenBChange: (token: WhitelistedToken) => void;
}
