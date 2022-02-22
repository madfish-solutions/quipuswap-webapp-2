import { TezosToolkit } from '@taquito/taquito';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { getContract } from '@utils/dapp';

export const harvestAssetsApi = async (tezos: TezosToolkit, stakingId: number, rewardsReceiver: string) => {
  const stakingContract = await getContract(tezos, STAKING_CONTRACT_ADDRESS);
  const harvestParams = stakingContract.methods.harvest(stakingId, rewardsReceiver);

  return await harvestParams.send();
};
