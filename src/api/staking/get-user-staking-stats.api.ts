import { BigMapAbstraction, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { RawUserStakingStats } from '@interfaces/staking.interfaces';
import { getStorageInfo } from '@utils/dapp';

const DEFAULT_STATS_VALUE = 0;

export const getUserStakingStats = async (
  tezos: TezosToolkit,
  accountPkh: string,
  id: BigNumber
): Promise<RawUserStakingStats> => {
  const stakingStorage = await getStorageInfo(tezos, STAKING_CONTRACT_ADDRESS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usersInfo: BigMapAbstraction = (stakingStorage as any).storage.users_info;

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
