import BigNumber from 'bignumber.js';

import { Token } from '@shared/types';

interface YouvesStake {
  id: BigNumber;
  stake: BigNumber;
  disc_factor: BigNumber;
  age_timestamp: string;
}

export interface TabProps {
  contractAddress: string;
  stakes: YouvesStake[];
  stakeId: BigNumber;
  lpToken: Nullable<Token>;
  userLpTokenBalance: Nullable<BigNumber>;
  tokens: Token[];
}
