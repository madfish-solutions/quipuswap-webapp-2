import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config/config';

export const harvestAssetsApi = async (tezos: TezosToolkit, farmingId: BigNumber, rewardsReceiver: string) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const harvestParams = farmingContract.methods.harvest(farmingId, rewardsReceiver);

  return await harvestParams.send();
};
