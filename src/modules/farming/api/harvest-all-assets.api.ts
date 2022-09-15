import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS_OLD } from '@config/environment';
import { batchOperations } from '@shared/helpers';

export const harvestFarmingIds = async (tezos: TezosToolkit, farmingIds: BigNumber[], rewardsReceiver: string) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS_OLD);

  return farmingIds.map(farmingId => farmingContract.methods.harvest(farmingId, rewardsReceiver));
};

export const getHarvestAllParams = async (tezos: TezosToolkit, farmingIds: BigNumber[], rewardsReceiver: string) => {
  return (await harvestFarmingIds(tezos, farmingIds, rewardsReceiver)).map(op => op.toTransferParams());
};

export const harvestAllAssets = async (tezos: TezosToolkit, farmingIds: BigNumber[], rewardsReceiver: string) => {
  const harvestParams = await harvestFarmingIds(tezos, farmingIds, rewardsReceiver);

  return await (await batchOperations(tezos, harvestParams)).send();
};
