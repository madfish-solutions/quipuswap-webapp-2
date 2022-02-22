import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS, STAKING_REFERRER_CONTRACT } from '@app.config';
import { getContract } from '@utils/dapp';

export const stakeAssetsApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  stakingId: number,
  amount: BigNumber,
  bakerAddress: string
) => {
  const stakingContract = await getContract(tezos, STAKING_CONTRACT_ADDRESS);
  const depositParams = stakingContract.methods.deposit(
    stakingId,
    amount,
    STAKING_REFERRER_CONTRACT,
    accountPkh,
    bakerAddress
  );

  return await depositParams.send();
};
