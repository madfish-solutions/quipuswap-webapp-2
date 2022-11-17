import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config/environment';

export const harvestAssetsApi = async (tezos: TezosToolkit, farmingId: string, rewardsReceiver: string) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const harvestParams = farmingContract.methods.harvest(new BigNumber(farmingId), rewardsReceiver);

  return await harvestParams.send();
};
