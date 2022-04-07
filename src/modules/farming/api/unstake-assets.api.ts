import { batchify } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config/enviroment';

export const unstakeAssetsApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  farmingId: BigNumber,
  amount: BigNumber
) => {
  const farmingParams = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const withdrawParams = farmingParams.methods.withdraw(farmingId, amount, accountPkh, accountPkh);

  return await batchify(tezos.wallet.batch([]), [
    withdrawParams.toTransferParams({
      storageLimit: 250
    })
  ]).send();
};
