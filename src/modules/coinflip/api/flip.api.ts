import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { COINFLIP_CONTRACT_ADDRESS } from '@config/enviroment';

// TODO
export const flipApi = async (tezos: TezosToolkit, farmingId: BigNumber, rewardsReceiver: string) => {
  const farmingContract = await tezos.wallet.at(COINFLIP_CONTRACT_ADDRESS);
  const harvestParams = farmingContract.methods.harvest(farmingId, rewardsReceiver);

  return await harvestParams.send();
};
