import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { DEFAULT_STABLESWAP_POOL_ID, STABLESWAP_FARM_ACCUM_PRECISION, ZERO_AMOUNT } from '@config/constants';
import { getStorageInfo } from '@shared/dapp/get-storage-info';
import { isExist, isNull, toArray } from '@shared/helpers';
import { nat, Nullable } from '@shared/types';

import { earningsMapSchema, rewardMapSchema } from '../schemas/get-staker-info.schemas';
import {
  EarningsValue,
  RawStakerInfo,
  StableFarmItem,
  StableswapStorage,
  StakerAccumulator,
  StakersBalanceValue
} from '../types';

const DEFAULT_VALUE = new BigNumber('0');

const getHarvestedStakerRewards = (
  { balance: stakerBalance, earnings }: StakersBalanceValue,
  poolStakerAccumulator: StakerAccumulator
) => {
  const result = {
    yourDeposit: stakerBalance,
    yourReward: new MichelsonMap<nat, nat>(rewardMapSchema)
  };

  for (const [i, poolAccumF] of poolStakerAccumulator.accumulator_f.entries()) {
    const reward = earnings.get(i) ?? {
      former_f: new BigNumber(ZERO_AMOUNT),
      reward_f: new BigNumber(ZERO_AMOUNT)
    };
    const newFormerF = stakerBalance.multipliedBy(poolAccumF);
    const newRewardValue = reward.reward_f.plus(newFormerF.minus(reward.former_f).abs());
    const rewardAmt = newRewardValue.dividedToIntegerBy(STABLESWAP_FARM_ACCUM_PRECISION);
    result.yourReward.set(i, rewardAmt);
  }

  return result;
};

const getSinglePoolStakerInfo = async (
  contractAddress: string,
  accountPkh: string,
  tezos: TezosToolkit,
  poolId: BigNumber
) => {
  const { storage } = await getStorageInfo<StableswapStorage>(tezos, contractAddress);
  const { pools, stakers_balance } = storage;
  const stakerAccum = (await stakers_balance.get([accountPkh, poolId])) ?? {
    balance: new BigNumber(ZERO_AMOUNT),
    earnings: new MichelsonMap<nat, EarningsValue>(earningsMapSchema)
  };
  const pool = await pools.get(poolId);

  return isExist(pool)
    ? getHarvestedStakerRewards(stakerAccum, pool.staker_accumulator)
    : { yourDeposit: DEFAULT_VALUE, yourReward: null };
};

export const getStakerInfo = async (
  tezos: Nullable<TezosToolkit>,
  stableFarmsList: Array<StableFarmItem> | StableFarmItem,
  accountPkh: Nullable<string>
): Promise<Array<RawStakerInfo>> => {
  if (isNull(tezos) || isNull(accountPkh)) {
    return toArray(stableFarmsList).map(() => ({ yourReward: null, yourDeposit: DEFAULT_VALUE }));
  }

  return await Promise.all(
    toArray(stableFarmsList).map(
      async ({ contractAddress }) =>
        await getSinglePoolStakerInfo(contractAddress, accountPkh, tezos, new BigNumber(DEFAULT_STABLESWAP_POOL_ID))
    )
  );
};
