import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { allowContractSpendYourTokens } from '@containers/liquidity/liquidity-cards/blockchain';
import { Token } from '@utils/types';

const RESET_AMOUNT = 0;

export const withApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams
) => {
  const resetOperator = allowContractSpendYourTokens(tezos, token, contractAddress, RESET_AMOUNT, accountPkh);

  const updateOperator = allowContractSpendYourTokens(tezos, token, contractAddress, amount, accountPkh);

  const [resetOperatorResolved, updateOperatorResolved] = await Promise.all([resetOperator, updateOperator]);

  return await batchify(tezos.wallet.batch([]), [
    resetOperatorResolved.toTransferParams(),
    updateOperatorResolved.toTransferParams(),
    operationParams,
    resetOperatorResolved.toTransferParams()
  ]).send();
};
