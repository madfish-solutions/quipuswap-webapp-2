import { batchify } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS, STAKING_REFERRER_CONTRACT } from '@app.config';
import { allowContractSpendYourTokens } from '@containers/liquidity/liquidity-cards/blockchain';
import { Token } from '@utils/types';

const RESET_AMOUNT = 0;

export const stakeAssetsApi = async (
  tezos: TezosToolkit,
  tokenAddress: Token,
  accountPkh: string,
  stakingId: number,
  amount: BigNumber,
  bakerAddress: string
) => {
  const stakingContract = await tezos.wallet.at(STAKING_CONTRACT_ADDRESS);

  const stakingParams = stakingContract.methods
    .deposit(stakingId, amount, STAKING_REFERRER_CONTRACT, accountPkh, bakerAddress)
    .toTransferParams();

  const resetOperator = allowContractSpendYourTokens(
    tezos,
    tokenAddress,
    STAKING_CONTRACT_ADDRESS,
    RESET_AMOUNT,
    accountPkh
  );

  const updateOperator = allowContractSpendYourTokens(
    tezos,
    tokenAddress,
    STAKING_CONTRACT_ADDRESS,
    amount,
    accountPkh
  );

  const [resetOperatorResolved, updateOperatorResolved] = await Promise.all([resetOperator, updateOperator]);

  return await batchify(tezos.wallet.batch([]), [
    resetOperatorResolved.toTransferParams(),
    updateOperatorResolved.toTransferParams(),
    stakingParams,
    resetOperatorResolved.toTransferParams()
  ]).send();
};
