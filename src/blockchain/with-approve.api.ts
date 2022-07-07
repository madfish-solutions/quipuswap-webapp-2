import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { isExist, isTezosToken, isTokenFa12, toArray } from '@shared/helpers';
import { AmountToken, Token, TokenAddress } from '@shared/types';

import { getAllowance } from './get-allowance';
import { sendBatch } from './send-batch';

const RESET_AMOUNT = 0;

const getFA12ApproveParams = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token | TokenAddress,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams[]
) => {
  const tokenContract = await tezos.wallet.at(token.contractAddress);
  const currentAllowance = await getAllowance(tezos, tokenContract.address, accountPkh, contractAddress);
  const resetAllowanceParams = tokenContract.methods.approve(contractAddress, RESET_AMOUNT).toTransferParams();
  const setAllowanceParams = tokenContract.methods.approve(contractAddress, amount).toTransferParams();

  return currentAllowance.isGreaterThan(RESET_AMOUNT)
    ? [resetAllowanceParams, setAllowanceParams, ...operationParams]
    : [setAllowanceParams, ...operationParams];
};

const getFA2ApproveParams = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token | TokenAddress,
  accountPkh: string,
  operationParams: TransferParams[]
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
    .toTransferParams();
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
    .toTransferParams();

  return [addOperatorParams, ...operationParams, removeOperatorParams];
};

export const getApproveParams = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token | TokenAddress,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams[]
) => {
  if (isExist(token.fa2TokenId)) {
    return await getFA2ApproveParams(tezos, contractAddress, token, accountPkh, operationParams);
  }

  return await getFA12ApproveParams(tezos, contractAddress, token, accountPkh, amount, operationParams);
};

const withFA12ApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams[]
) => {
  const fa12ApproveParams = await getFA12ApproveParams(
    tezos,
    contractAddress,
    token,
    accountPkh,
    amount,
    operationParams
  );

  return await sendBatch(tezos, fa12ApproveParams);
};

const withFA2ApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  operationParams: TransferParams[]
) => {
  const fa2ApproveParams = await getFA2ApproveParams(tezos, contractAddress, token, accountPkh, operationParams);

  return await sendBatch(tezos, fa2ApproveParams);
};

export const withApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams[]
) => {
  if (isTezosToken(token)) {
    return await sendBatch(tezos, operationParams);
  }

  if (isTokenFa12(token)) {
    return await withFA12ApproveApi(tezos, contractAddress, token, accountPkh, amount, operationParams);
  }

  return await withFA2ApproveApi(tezos, contractAddress, token, accountPkh, operationParams);
};
export const withApproveApiForManyTokens = async (
  tezos: TezosToolkit,
  contractAddress: string,
  tokensAndAmounts: AmountToken | Array<AmountToken>,
  accountPkh: string,
  operationParams: TransferParams[]
) => {
  const tokensAndAmountsArray = toArray(tokensAndAmounts);

  let accumParams: TransferParams[] = operationParams;
  for (const { token, amount } of tokensAndAmountsArray) {
    accumParams = await getApproveParams(tezos, contractAddress, token, accountPkh, amount, accumParams);
  }

  return await sendBatch(tezos, accumParams);
};
