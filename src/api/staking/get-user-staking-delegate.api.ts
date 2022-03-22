import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@app.config';
import { StakingStorage } from '@interfaces/staking-storage.interfaces';
import { getStorageInfo } from '@utils/dapp';

export const getUserStakingDelegate = async (tezos: TezosToolkit, accountPkh: string, id: BigNumber) => {
  const {
    storage: { candidates }
  } = await getStorageInfo<StakingStorage>(tezos, FARMING_CONTRACT_ADDRESS);

  return (await candidates.get<string>([id, accountPkh])) ?? null;
};
