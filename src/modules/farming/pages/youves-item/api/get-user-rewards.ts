import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getUserBalance } from '@blockchain';
import { MS_IN_SECOND, PRECISION_FACTOR, ZERO_AMOUNT } from '@config/constants';
import { getTokenMetadata } from '@shared/api';
import { getStorageInfo } from '@shared/dapp';
import { getLastElement, isNull, isUndefined } from '@shared/helpers';
import { Standard, Undefined } from '@shared/types';

import { YouvesFarmStakes, YouvesFarmStorage } from './types';

// TODO: Add fa12 support when contracts will be ready

export const getUserRewards = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  contractAddress: Undefined<string>
) => {
  if (isNull(tezos) || isNull(accountPkh) || isUndefined(contractAddress)) {
    return { claimable_reward: new BigNumber(ZERO_AMOUNT), full_reward: new BigNumber(ZERO_AMOUNT) };
  }

  let _disc_factor;

  const {
    deposit_token,
    last_rewards,
    max_release_period,
    stakes,
    total_stake,
    disc_factor,
    stakes_owner_lookup,
    reward_token
  } = await getStorageInfo<YouvesFarmStorage>(tezos, contractAddress);

  const current_rewards =
    (await getUserBalance(tezos, contractAddress, reward_token.address, Standard.Fa2, reward_token.id.toNumber())) ??
    new BigNumber(ZERO_AMOUNT);

  if (total_stake.isGreaterThan(ZERO_AMOUNT)) {
    const reward = current_rewards.minus(last_rewards);
    _disc_factor = disc_factor.plus(reward.multipliedBy(PRECISION_FACTOR).idiv(total_stake));
  }

  const ids: Array<BigNumber> = (await stakes_owner_lookup.get(accountPkh)) ?? [];
  const stake_age_timestamp =
    (await stakes.get<YouvesFarmStakes>(Number(getLastElement(ids))))?.age_timestamp ?? undefined;
  const stake_disc_factor = (await stakes.get<YouvesFarmStakes>(Number(getLastElement(ids))))?.disc_factor ?? undefined;
  const stake_stake = (await stakes.get<YouvesFarmStakes>(Number(getLastElement(ids))))?.stake ?? undefined;

  if (
    isUndefined(stake_age_timestamp) ||
    isUndefined(stake_disc_factor) ||
    isUndefined(stake_stake) ||
    isUndefined(_disc_factor)
  ) {
    return { claimable_reward: new BigNumber(ZERO_AMOUNT), full_reward: new BigNumber(ZERO_AMOUNT) };
  }

  const max_release_period_ms = max_release_period.multipliedBy(MS_IN_SECOND).toNumber();

  const stake_age = Math.min(Date.now() - new Date(stake_age_timestamp).getTime(), max_release_period_ms);
  const curr_disc_factor = _disc_factor?.minus(stake_disc_factor);
  const full_reward = stake_stake.multipliedBy(curr_disc_factor).idiv(PRECISION_FACTOR);
  const claimable_reward = full_reward.multipliedBy(stake_age).idiv(max_release_period_ms);

  const depositTokenMetadata = await getTokenMetadata({
    contractAddress: deposit_token.address,
    fa2TokenId: Number(deposit_token.id)
  });
  const depositTokenDecimals = depositTokenMetadata?.decimals ?? ZERO_AMOUNT;
  const depositTokenPrecision = Number(`1e${depositTokenDecimals}`);

  return {
    claimable_reward: claimable_reward.dividedBy(depositTokenPrecision),
    full_reward: full_reward.dividedBy(depositTokenPrecision)
  };
};
