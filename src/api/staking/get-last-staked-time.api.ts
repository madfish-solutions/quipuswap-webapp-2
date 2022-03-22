import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@app.config';
import { StakedAmount, StakingStorage } from '@interfaces/staking-storage.interfaces';
import { getStorageInfo } from '@utils/dapp';

export const getLastStakedTime = async (tezos: TezosToolkit, accountPkh: string, id: BigNumber) => {
  const {
    storage: { users_info: usersInfo }
  } = await getStorageInfo<StakingStorage>(tezos, FARMING_CONTRACT_ADDRESS);

  const stakingStats = await usersInfo.get<StakedAmount>([id, accountPkh]);

  return stakingStats ? new Date(stakingStats.last_staked).getTime() : null;
};
