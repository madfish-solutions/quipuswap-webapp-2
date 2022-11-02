import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getContract, getStorageInfo } from '@shared/dapp';

export const getBucketContractApi = async (tezos: TezosToolkit, contractAddress: string, poolId: BigNumber) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storage = await getStorageInfo<any>(tezos, contractAddress);

  const { bucket: bucketAddress } = await storage.storage.pairs.get(poolId);

  if (bucketAddress) {
    return await getContract(tezos, bucketAddress);
  }

  return null;
};
