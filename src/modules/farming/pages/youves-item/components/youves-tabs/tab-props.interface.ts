import BigNumber from 'bignumber.js';

import { Token } from '@shared/types';

export interface TabProps {
  contractAddress: string;
  stakes: BigNumber[];
  stakeId: BigNumber;
  lpToken: Nullable<Token>;
  userLpTokenBalance: Nullable<BigNumber>;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
}
