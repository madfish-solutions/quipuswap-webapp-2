import { BigMapAbstraction, TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { getStorageInfo } from '@shared/dapp';

//TODO: can be used to getting reward info
export const getStableFarmStakerBalanceApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  accountPkh: string
) => {
  const storage = await getStorageInfo<{ storage: { stakers_balance: BigMapAbstraction } }>(tezos, contractAddress);

  const stakersBalanceValue = await storage.storage.stakers_balance.get<{ balance: BigNumber }>([
    accountPkh,
    DEFAULT_STABLESWAP_POOL_ID
  ]);

  return stakersBalanceValue?.balance ?? new BigNumber('0');
};
