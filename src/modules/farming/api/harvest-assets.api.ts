import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS_OLD } from '@config/environment';

export const harvestAssetsApi = async (tezos: TezosToolkit, farmingId: BigNumber, rewardsReceiver: string) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS_OLD);
  const harvestParams = farmingContract.methods.harvest(farmingId, rewardsReceiver);

  return await harvestParams.send();
};
