import { ContractAbstraction, ContractProvider, TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { BucketContractStorage, DexTwoContractStorage } from '@modules/liquidity/types';
import { getContract, getStorageInfo } from '@shared/dapp';
import { defined } from '@shared/helpers';

// TODO: https://madfish.atlassian.net/browse/QUIPU-613
export class BlockchainDexTwoLiquidityApi {
  static async getBucketContract(tezos: TezosToolkit, contractAddress: string, poolId: BigNumber) {
    const storage = await getStorageInfo<DexTwoContractStorage>(tezos, contractAddress);

    const { bucket: bucketAddress } = defined(await storage.storage.pairs.get(poolId));

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
