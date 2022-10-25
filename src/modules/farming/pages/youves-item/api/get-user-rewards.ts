import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getUserBalance } from '@blockchain';
import { PRECISION_FACTOR, ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { getStorageInfo } from '@shared/dapp';
import { getLastElement, isNull, isUndefined } from '@shared/helpers';
import { Standard, Undefined } from '@shared/types';

import { getRewards, getTokenDecimalsAndPrecision } from '../helpers';
import { YouvesFarmStakes, YouvesFarmStorage } from './types';

// TODO: Add fa12 support when contracts will be ready

const DEFAULT_REWARDS = { claimableReward: ZERO_AMOUNT_BN, longTermReward: ZERO_AMOUNT_BN };

export const getUserRewards = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  contractAddress: Undefined<string>
) => {
  if (isNull(tezos) || isNull(accountPkh) || isUndefined(contractAddress)) {
    return DEFAULT_REWARDS;
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

  const current_contract_balance =
    (await getUserBalance(tezos, contractAddress, reward_token.address, Standard.Fa2, reward_token.id.toNumber())) ??
    ZERO_AMOUNT_BN;

  if (total_stake.isGreaterThan(ZERO_AMOUNT)) {
    const reward = current_contract_balance.minus(last_rewards);
    _disc_factor = disc_factor.plus(reward.multipliedBy(PRECISION_FACTOR).dividedToIntegerBy(total_stake));
  }

  const ids: Array<BigNumber> = (await stakes_owner_lookup.get(accountPkh)) ?? [];
  const last_stake = (await stakes.get<YouvesFarmStakes>(Number(getLastElement(ids)))) ?? undefined;

  if (isUndefined(last_stake) || isUndefined(_disc_factor)) {
    return DEFAULT_REWARDS;
  }

  const { claimable_reward, full_reward } = getRewards(last_stake, max_release_period, _disc_factor);
  const { tokenDecimals, tokenPrecision } = await getTokenDecimalsAndPrecision(deposit_token.address, deposit_token.id);

  return {
    claimableReward: claimable_reward.dividedBy(tokenPrecision).decimalPlaces(tokenDecimals),
    longTermReward: full_reward.dividedBy(tokenPrecision).decimalPlaces(tokenDecimals)
  };
};
