import { TezosToolkit } from '@taquito/taquito';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';

export const harvestAssetsApi = async (tezos: TezosToolkit, stakingId: number, rewardsReceiver: string) => {
  const stakingContract = await tezos.contract.at(STAKING_CONTRACT_ADDRESS);
  const harvestParams = stakingContract.methods.harvest(stakingId, rewardsReceiver);

  return await harvestParams.send();
};
