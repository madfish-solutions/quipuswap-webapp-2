import { TezosToolkit } from '@taquito/taquito';

import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { batchOperations, defined, getLastElementFromArray, getWalletContract } from '@shared/helpers';

import { BlockchainYouvesFarmingApi } from './blockchain/youves-farming.api';
import { FarmVersion } from '../interfaces';

interface FarmingId {
  id: string;
  contractAddress?: string;
  version: FarmVersion;
}

export const harvestFarmingIds = async (tezos: TezosToolkit, farmingIds: FarmingId[], rewardsReceiver: string) => {
  const v1FarmingContract = await getWalletContract(tezos.wallet, FARMING_CONTRACT_ADDRESS);

  return await Promise.all(
    farmingIds.map(async ({ id, contractAddress, version }) => {
      switch (version) {
        case FarmVersion.v1:
          return v1FarmingContract.methods.harvest(id, rewardsReceiver);
        case FarmVersion.v2:
        case FarmVersion.v3:
          return await BlockchainYouvesFarmingApi.makeHarvestMethod(
            tezos,
            defined(contractAddress),
            getLastElementFromArray(
              await BlockchainYouvesFarmingApi.getStakesIds(tezos, rewardsReceiver, defined(contractAddress))
            )
          );
        default:
          throw new Error('Unknown farm version');
      }
    })
  );
};

export const getHarvestAllParams = async (tezos: TezosToolkit, farmingIds: FarmingId[], rewardsReceiver: string) => {
  return (await harvestFarmingIds(tezos, farmingIds, rewardsReceiver)).map(op => op.toTransferParams());
};

export const harvestAllAssets = async (tezos: TezosToolkit, farmingIds: FarmingId[], rewardsReceiver: string) => {
  const harvestParams = await harvestFarmingIds(tezos, farmingIds, rewardsReceiver);

  return await (await batchOperations(tezos, harvestParams)).send();
};
