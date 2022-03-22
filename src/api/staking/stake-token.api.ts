import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS, FARMING_REFERRER_CONTRACT } from '@app.config';
import { Token } from '@utils/types';

import { withApproveApi } from '../helpers/with-approve-api';

export const stakeTokenApi = async (
  tezos: TezosToolkit,
  token: Token,
  accountPkh: string,
  stakingId: BigNumber,
  amount: BigNumber,
  bakerAddress: string
) => {
  const stakingContract = await tezos.wallet.at(FARMING_CONTRACT_ADDRESS);
  const stakingParams = stakingContract.methods
    .deposit(stakingId, amount, FARMING_REFERRER_CONTRACT, accountPkh, bakerAddress)
    .toTransferParams();

  return await withApproveApi(tezos, FARMING_CONTRACT_ADDRESS, token, accountPkh, amount, stakingParams);
};
