import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';

export const sendBatch = async (tezos: TezosToolkit, operationParams: TransferParams[]) =>
  await batchify(tezos.wallet.batch([]), operationParams).send();
