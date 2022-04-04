import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@app.config';

export const unstakeAssetsApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  farmingId: BigNumber,
  amount: BigNumber
) => {
  const farmingParams = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const withdrawParams = farmingParams.methods.withdraw(farmingId, amount, accountPkh, accountPkh);

  return await withdrawParams.send({ storageLimit: 50 });
};
