import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { FARMING_REFERRER_CONTRACT } from '@config/config';
import { Token } from '@shared/types';

export const stakeTokenApi = async (
  tezos: TezosToolkit,
  token: Token,
  accountPkh: string,
  farmingId: BigNumber,
  amount: BigNumber,
  bakerAddress: string,
  contractAddress: string
) => {
  const farmingContract = await tezos.wallet.at(contractAddress);
  const farmingParams = farmingContract.methods
    .deposit(farmingId, amount, FARMING_REFERRER_CONTRACT, accountPkh, bakerAddress)
    .toTransferParams();

  return await withApproveApi(tezos, contractAddress, token, accountPkh, amount, [farmingParams]);
};
