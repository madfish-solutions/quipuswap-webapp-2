import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { getStorageInfo } from '@utils/dapp';
import { Nullable } from '@utils/types';

import { StakingContractStorage } from './get-user-staking.types';

export const getUserStakingDelegate = async (
  tezos: TezosToolkit,
  accountPkh: string,
  id: BigNumber
): Promise<Nullable<string>> => {
  const {
    storage: { candidates }
  } = await getStorageInfo<StakingContractStorage>(tezos, STAKING_CONTRACT_ADDRESS);

  return (await candidates.get([id, accountPkh])) ?? null;
};
