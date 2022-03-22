import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@app.config';

export const harvestAssetsApi = async (tezos: TezosToolkit, stakingId: BigNumber, rewardsReceiver: string) => {
  const stakingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const harvestParams = stakingContract.methods.harvest(stakingId, rewardsReceiver);

  return await harvestParams.send();
};
