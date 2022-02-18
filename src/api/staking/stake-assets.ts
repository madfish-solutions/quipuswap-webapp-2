import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { batchOperations } from '@utils/dapp/batch-operations';
import { Nullable } from '@utils/types';

export const stakeAssets = async (
  tezos: TezosToolkit,
  contract: string,
  rewardsReceiver: string,
  stakingId: number,
  amount: BigNumber,
  refferer: Nullable<string>,
  candidate: string
) => {
  const stakingContract = await tezos.wallet.at(contract);
  const depositParams = stakingContract.methods.deposit(stakingId, amount, refferer, rewardsReceiver, candidate);

  return await (await batchOperations(tezos, [depositParams])).send();
};
