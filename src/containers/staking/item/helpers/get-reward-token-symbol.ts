import { StakingItem } from '@interfaces/staking.interfaces';

import { normalizeTokenSymbol } from './normalize-token-symbol';

export const getRewardTokenSymbol = (stakeItem: StakingItem) =>
  normalizeTokenSymbol(stakeItem.rewardToken.metadata.symbol);
