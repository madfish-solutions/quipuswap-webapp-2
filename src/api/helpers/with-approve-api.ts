import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';
import { getAllowance } from '@utils/dapp';
import { isTezosToken } from '@utils/helpers';
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
  const operationsParams: TransferParams[] = [];
  if (isTezosToken(token)) {
    operationsParams.push(operationParams);
  } else {
    const tokenContract = await tezos.wallet.at(token.contractAddress);
    if (token.type === Standard.Fa12) {
      const currentAllowance = await getAllowance(tezos, token.contractAddress, accountPkh, contractAddress);
      if (currentAllowance.isGreaterThan(RESET_AMOUNT)) {
        operationsParams.push(tokenContract.methods.approve(contractAddress, RESET_AMOUNT).toTransferParams());
      }
      operationsParams.push(tokenContract.methods.approve(contractAddress, amount).toTransferParams(), operationParams);
    } else {
      operationsParams.push(
        tokenContract.methods
          .update_operators([
            {
              add_operator: {
                owner: accountPkh,
                operator: contractAddress,
                token_id: token.fa2TokenId
              }
            }
          ])
          .toTransferParams(),
        operationParams,
        tokenContract.methods
          .update_operators([
            {
              remove_operator: {
                owner: accountPkh,
                operator: contractAddress,
                token_id: token.fa2TokenId
              }
            }
          ])
          .toTransferParams()
      );
    }
  }

  return await batchify(tezos.wallet.batch([]), operationsParams).send();
};
