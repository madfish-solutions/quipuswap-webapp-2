import { batchify } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { getContract } from '@utils/dapp';
import { Token } from '@utils/types';

export const unstakeAssetsApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  stakingId: number,
  token: Token,
  amount: BigNumber
) => {
  const stakingContract = await getContract(tezos, STAKING_CONTRACT_ADDRESS);
  const withdrawParams = stakingContract.methods.withdraw(stakingId, amount, accountPkh, accountPkh);

  return await batchify(tezos.wallet.batch([]), [withdrawParams.toTransferParams()]).send();
};
