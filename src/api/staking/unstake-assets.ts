import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { batchOperations } from '@utils/dapp/batch-operations';

export const unstakeAssets = async (
  tezos: TezosToolkit,
  contract: string,
  stakingId: number,
  amount: BigNumber,
  receiver: string,
  rewardsReceiver: string
) => {
  const stakingContract = await tezos.wallet.at(contract);
  const withdrawParams = stakingContract.methods.withdraw(stakingId, amount, receiver, rewardsReceiver);

  return await (await batchOperations(tezos, [withdrawParams])).send();
};
