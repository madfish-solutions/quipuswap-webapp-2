import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { WTEZ_TOKEN } from '@config/tokens';
import { getContract } from '@shared/dapp';

import { sendBatch } from './send-batch';

export const getWithWtezMintOnInputParams = async (
  tezos: TezosToolkit,
  mutezAmount: BigNumber,
  accountPkh: string,
  operationParams: TransferParams[]
) => {
  const wTezContract = await getContract(tezos, WTEZ_TOKEN.contractAddress);

  return [
    wTezContract.methods.mint(accountPkh).toTransferParams({ amount: mutezAmount.toNumber(), mutez: true })
  ].concat(operationParams);
};

export const withWtezMintOnInput = async (
  tezos: TezosToolkit,
  mutezAmount: BigNumber,
  accountPkh: string,
  operationParams: TransferParams[]
) => await sendBatch(tezos, await getWithWtezMintOnInputParams(tezos, mutezAmount, accountPkh, operationParams));
