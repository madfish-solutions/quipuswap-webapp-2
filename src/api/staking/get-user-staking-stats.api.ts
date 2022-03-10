import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { StakedAmount, StakingStorage } from '@interfaces/staking-storage.interfaces';
import { getStorageInfo } from '@utils/dapp';

const DEFAULT_STAKED_AMOUNT = 0;
const DEFAULT_STATS = {
  allowances: [],
  staked: new BigNumber(DEFAULT_STAKED_AMOUNT),
  prev_staked: new BigNumber(DEFAULT_STAKED_AMOUNT),
  prev_earned: new BigNumber(DEFAULT_STAKED_AMOUNT),
  last_staked: new Date(DEFAULT_STAKED_AMOUNT).toISOString(),
  earned: new BigNumber(DEFAULT_STAKED_AMOUNT),
  claimed: new BigNumber(DEFAULT_STAKED_AMOUNT)
};

export const getUserStakingStats = async (tezos: TezosToolkit, accountPkh: string, id: BigNumber) => {
  const {
    storage: { users_info: usersInfo }
  } = await getStorageInfo<StakingStorage>(tezos, STAKING_CONTRACT_ADDRESS);

  return (await usersInfo.get<StakedAmount>([id, accountPkh])) ?? DEFAULT_STATS;
};
