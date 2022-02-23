import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS, STAKING_REFERRER_CONTRACT } from '@app.config';
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
  const stakingContract = await tezos.wallet.at(STAKING_CONTRACT_ADDRESS);
  const stakingParams = stakingContract.methods
    .deposit(stakingId, amount, STAKING_REFERRER_CONTRACT, accountPkh, bakerAddress)
    .toTransferParams();

  return await withApproveApi(tezos, STAKING_CONTRACT_ADDRESS, token, accountPkh, amount, stakingParams);
};
