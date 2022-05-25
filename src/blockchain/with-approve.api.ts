import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { isTezosToken, toArray } from '@shared/helpers';
import { Standard, Token } from '@shared/types';

import { getAllowance } from './get-allowance';

const RESET_AMOUNT = 0;

const getFA12ApproveParams = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
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
  token: Token,
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

const getApproveParams = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams[]
) => {
  if (token.type === Standard.Fa12) {
    return await getFA12ApproveParams(tezos, contractAddress, token, accountPkh, amount, operationParams);
  }

  return await getFA2ApproveParams(tezos, contractAddress, token, accountPkh, operationParams);
};

const withFA12ApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  amount: BigNumber.Value,
  operationParams: TransferParams[]
) => {
  const operationsParams = await getFA12ApproveParams(
    tezos,
    contractAddress,
    token,
    accountPkh,
    amount,
    operationParams
  );

  return await batchify(tezos.wallet.batch([]), operationsParams).send();
};

const withFA2ApproveApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  token: Token,
  accountPkh: string,
  operationParams: TransferParams[]
) => {
  const operationsParams = await getFA2ApproveParams(tezos, contractAddress, token, accountPkh, operationParams);

  return await batchify(tezos.wallet.batch([]), operationsParams).send();
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
    return await batchify(tezos.wallet.batch([]), [...operationParams]).send();
  }

  if (token.type === Standard.Fa12) {
    return await withFA12ApproveApi(tezos, contractAddress, token, accountPkh, amount, operationParams);
  }

  return await withFA2ApproveApi(tezos, contractAddress, token, accountPkh, operationParams);
};
export const withApproveApiForManyTokens = async (
  tezos: TezosToolkit,
  contractAddress: string,
  tokensAndAmounts: { token: Token; amount: BigNumber } | Array<{ token: Token; amount: BigNumber }>,
  accountPkh: string,
  operationParams: TransferParams[]
) => {
  const tokensAndAmountsArray = toArray(tokensAndAmounts);

  let accumParams: TransferParams[] = operationParams;
  for (const { token, amount } of tokensAndAmountsArray) {
    accumParams = await getApproveParams(tezos, contractAddress, token, accountPkh, amount, accumParams);
  }

  return await batchify(tezos.wallet.batch([]), accumParams).send();
};
