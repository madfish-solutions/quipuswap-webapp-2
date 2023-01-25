import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { WTEZ_TOKEN } from '@config/tokens';
import { getContract } from '@shared/dapp';

import { sendBatch } from './send-batch';

export const getWithWtezBurnOnOutputParams = async (
  tezos: TezosToolkit,
  mutezAmount: BigNumber,
  accountPkh: string,
  operationParams: TransferParams[]
) => {
  if (mutezAmount.isZero()) {
    return operationParams;
  }

  const wTezContract = await getContract(tezos, WTEZ_TOKEN.contractAddress);

  return operationParams.concat(wTezContract.methods.burn(accountPkh, accountPkh, mutezAmount).toTransferParams());
};

export const withWtezBurnOnOutput = async (
  tezos: TezosToolkit,
  mutezAmount: BigNumber,
  accountPkh: string,
  operationParams: TransferParams[]
) => await sendBatch(tezos, await getWithWtezBurnOnOutputParams(tezos, mutezAmount, accountPkh, operationParams));
