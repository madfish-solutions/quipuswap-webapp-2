import { StakedAmount } from '@interfaces/staking-storage.interfaces';
import { Nullable } from '@utils/types';

export const mapUserStakingStats = (raw: Nullable<StakedAmount>) =>
  raw && {
    lastStaked: raw.last_staked,
    staked: raw.staked,
    earned: raw.earned,
    claimed: raw.claimed,
    prevEarned: raw.prev_earned,
    prevStaked: raw.prev_staked
  };
