import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { SendParams } from '@taquito/taquito/dist/types/contract/contract-methods/contract-method-interface';
import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';
import { getAllowance } from '@utils/dapp';
import { isTezosToken } from '@utils/helpers';
import { Token } from '@utils/types';

const RESET_AMOUNT = 0;

const withFA12ApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams,
  sendParams?: Partial<SendParams>
) => {
  const tokenContract = await tezos.wallet.at(token.contractAddress);
  const currentAllowance = await getAllowance(tezos, tokenContract.address, accountPkh, contractAddress);
  const resetAllowanceParams = tokenContract.methods
    .approve(contractAddress, RESET_AMOUNT)
    .toTransferParams(sendParams);
  const setAllowanceParams = tokenContract.methods.approve(contractAddress, amount).toTransferParams(sendParams);

  const operationsParams = currentAllowance.isGreaterThan(RESET_AMOUNT)
    ? [resetAllowanceParams, setAllowanceParams, operationParams]
    : [setAllowanceParams, operationParams];

  return await batchify(tezos.wallet.batch([]), operationsParams).send();
};

const withFA2ApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  operationParams: TransferParams,
  sendParams?: Partial<SendParams>
) => {
  const tokenContract = await tezos.wallet.at(token.contractAddress);
  const addOperatorParams = tokenContract.methods
    .update_operators([
      {
        add_operator: {
          owner: accountPkh,
          operator: contractAddress,
          token_id: token.fa2TokenId
        }
      }
    ])
    .toTransferParams(sendParams);
  const removeOperatorParams = tokenContract.methods
    .update_operators([
      {
        remove_operator: {
          owner: accountPkh,
          operator: contractAddress,
          token_id: token.fa2TokenId
        }
      }
    ])
    .toTransferParams(sendParams);

  return await batchify(tezos.wallet.batch([]), [addOperatorParams, operationParams, removeOperatorParams]).send();
};

export const withApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams,
  sendParams?: Partial<SendParams>
) => {
  if (isTezosToken(token)) {
    return await batchify(tezos.wallet.batch([]), [operationParams]).send();
  }
  if (token.type === Standard.Fa12) {
    return await withFA12ApproveApi(tezos, contractAddress, token, accountPkh, amount, operationParams, sendParams);
  }

  return await withFA2ApproveApi(tezos, contractAddress, token, accountPkh, operationParams, sendParams);
};
