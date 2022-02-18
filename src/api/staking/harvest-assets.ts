import { TezosToolkit } from '@taquito/taquito';

import { batchOperations } from '@utils/dapp/batch-operations';

export const harvestAssets = async (
  tezos: TezosToolkit,
  contract: string,
  stakingId: number,
  rewardsReceiver: string
) => {
  const stakingContract = await tezos.wallet.at(contract);
  const harvestParams = stakingContract.methods.harvest(stakingId, rewardsReceiver);

  return await (await batchOperations(tezos, [harvestParams])).send();
};
