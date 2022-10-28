import { BigNumber } from 'bignumber.js';

import { MS_IN_SECOND, PRECISION_FACTOR } from '@config/constants';
import { YouvesStakeDto } from '@modules/farming/dto';

import { YouvesFarmStakes } from '../api/types';

export const getRewards = (
  userStake: YouvesFarmStakes | YouvesStakeDto,
  maxReleasePerios: BigNumber,
  discFactor: BigNumber
) => {
  const { stake: ls_stake, age_timestamp: ls_age_timestamp, disc_factor: ls_disc_factor } = userStake;
  const max_release_period_ms = maxReleasePerios.multipliedBy(MS_IN_SECOND).toNumber();

  // eslint-disable-next-line no-console
  console.log(
    'get_rewards',
    ls_stake.toFixed(),
    ls_age_timestamp,
    ls_disc_factor.toFixed(),
    max_release_period_ms,
    discFactor.toFixed()
  );
  const stake_age = Math.min(Date.now() - new Date(ls_age_timestamp).getTime(), max_release_period_ms);
  const full_reward = ls_stake.multipliedBy(discFactor.minus(ls_disc_factor)).dividedToIntegerBy(PRECISION_FACTOR);
  const claimable_reward = full_reward.multipliedBy(stake_age).dividedToIntegerBy(max_release_period_ms);

  return { claimable_reward, full_reward };
};
