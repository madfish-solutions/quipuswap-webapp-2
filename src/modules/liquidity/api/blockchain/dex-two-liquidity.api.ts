import { ContractAbstraction, ContractProvider, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { BucketContractStorage, DexTwoContractStorage } from '@modules/liquidity/types';
import { getContract, getStorageInfo } from '@shared/dapp';
import { defined, unpackOption } from '@shared/helpers';
import { Nullable } from '@shared/types';

// TODO: https://madfish.atlassian.net/browse/QUIPU-613
export class BlockchainDexTwoLiquidityApi {
  static async getBucketContract(tezos: TezosToolkit, contractAddress: string, poolId: BigNumber) {
    const storage = await getStorageInfo<DexTwoContractStorage>(tezos, contractAddress);

    const pair = await storage.storage.pairs.get(poolId);

    const bucketAddress = unpackOption(defined(pair).bucket);

    if (bucketAddress) {
      return await getContract(tezos, bucketAddress);
    }

    return null;
  }

  static async getBakerAddress(bucketContract: Nullable<ContractAbstraction<ContractProvider>>) {
    if (bucketContract) {
      const { current_delegated: bakerAddress } = await bucketContract.storage<BucketContractStorage>();

      return bakerAddress;
    }

    return null;
  }
}
