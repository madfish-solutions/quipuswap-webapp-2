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
  stakedToken: Nullable<Token>;
  stakedTokenBalance: Nullable<BigNumber>;
  tokens: Token[];
}
