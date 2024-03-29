import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config/environment';

export const unstakeAssetsApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  farmingId: string,
  amount: BigNumber
) => {
  const farmingParams = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const withdrawParams = farmingParams.methods.withdraw(new BigNumber(farmingId), amount, accountPkh, accountPkh);

  return await withdrawParams.send();
};
