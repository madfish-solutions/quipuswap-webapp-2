import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { RawUserStakingStats } from '@interfaces/staking.interfaces';
import { getStorageInfo } from '@utils/dapp';

import { StakingContractStorage } from './get-user-staking.types';

const DEFAULT_STATS_VALUE = 0;

export const getUserStakingStats = async (
  tezos: TezosToolkit,
  accountPkh: string,
  id: BigNumber
): Promise<RawUserStakingStats> => {
  const {
    storage: { users_info: usersInfo }
  } = await getStorageInfo<StakingContractStorage>(tezos, STAKING_CONTRACT_ADDRESS);

  return (
    (await usersInfo.get([id, accountPkh])) ?? {
      staked: new BigNumber(DEFAULT_STATS_VALUE),
      prev_staked: new BigNumber(DEFAULT_STATS_VALUE),
      prev_earned: new BigNumber(DEFAULT_STATS_VALUE),
      last_staked: new Date(DEFAULT_STATS_VALUE).toISOString(),
      earned: new BigNumber(DEFAULT_STATS_VALUE),
      claimed: new BigNumber(DEFAULT_STATS_VALUE)
    }
  );
};
