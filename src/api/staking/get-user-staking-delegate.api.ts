import { BigMapAbstraction, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { getStorageInfo } from '@utils/dapp';
import { Nullable } from '@utils/types';

export const getUserStakingDelegate = async (
  tezos: TezosToolkit,
  accountPkh: string,
  id: BigNumber
): Promise<Nullable<string>> => {
  const stakingStorage = await getStorageInfo(tezos, STAKING_CONTRACT_ADDRESS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candidates: BigMapAbstraction = (stakingStorage as any).storage.candidates;

  return (await candidates.get([id, accountPkh])) ?? null;
};
