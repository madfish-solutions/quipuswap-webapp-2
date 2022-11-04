import { BigNumber } from 'bignumber.js';

import { MS_IN_SECOND } from '@config/constants';
import { YouvesStakeDto } from '@modules/farming/dto';
import { getNowTimestampInSeconds } from '@shared/helpers';

import { YouvesFarmStakes } from '../api/types';

export const getRewards = (
  userStake: YouvesFarmStakes | YouvesStakeDto,
  maxReleasePeriod: BigNumber,
  discFactor: BigNumber,
  precision: number
) => {
  const { stake: stakeAmount, age_timestamp: ageTimestamp, disc_factor: userDiscFactor } = userStake;
  const nowTimestamp = getNowTimestampInSeconds();
  const ageTimestampInSeconds = Math.floor(new Date(ageTimestamp).getTime() / MS_IN_SECOND);

  const stakeAge = BigNumber.min(nowTimestamp - ageTimestampInSeconds, maxReleasePeriod);
  const fullReward = stakeAmount.times(discFactor.minus(userDiscFactor)).dividedToIntegerBy(precision);
  const claimableReward = fullReward.times(stakeAge).dividedToIntegerBy(maxReleasePeriod);

  return { claimableReward, fullReward };
};
