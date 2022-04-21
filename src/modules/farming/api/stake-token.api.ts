import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { FARMING_CONTRACT_ADDRESS, FARMING_REFERRER_CONTRACT } from '@config/enviroment';
import { Token } from '@shared/types';

export const stakeTokenApi = async (
  tezos: TezosToolkit,
  token: Token,
  accountPkh: string,
  farmingId: BigNumber,
  amount: BigNumber,
  bakerAddress: string
) => {
  const farmingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const farmingParams = farmingContract.methods
    .deposit(farmingId, amount, FARMING_REFERRER_CONTRACT, accountPkh, bakerAddress)
    .toTransferParams();

  return await withApproveApi(tezos, FARMING_CONTRACT_ADDRESS, token, accountPkh, amount, [farmingParams]);
};
