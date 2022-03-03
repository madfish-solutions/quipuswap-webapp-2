import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';

export const unstakeAssetsApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  stakingId: number,
  amount: BigNumber
) => {
  const stakingContract = await tezos.wallet.at(STAKING_CONTRACT_ADDRESS);
  const withdrawParams = stakingContract.methods.withdraw(stakingId, amount, accountPkh, accountPkh);

  return await withdrawParams.send();
};
