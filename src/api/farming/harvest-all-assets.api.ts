import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@app.config';
import { batchOperations } from '@utils/dapp/batch-operations';

export const harvestAllAssets = async (tezos: TezosToolkit, stakingIds: BigNumber[], rewardsReceiver: string) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);

  const harvestParams = stakingIds.map(stakingId => farmingContract.methods.harvest(stakingId, rewardsReceiver));

  return await (await batchOperations(tezos, harvestParams)).send();
};
