import { OperationEntry } from '@taquito/rpc';
import { TezosToolkit } from '@taquito/taquito';

import { CONFIRM_TIMEOUT, SYNC_INTERVAL } from './confirm-operation.config';
import { ConfirmationTimeoutError, ConfirmPollingCanceledError } from './confirm-operation.errors';
import { ConfirmOperationOptions } from './confirm-operation.types';
import { findOperation } from './confirm-operation.helpers';

export const confirmOperation = async (
  tezos: TezosToolkit,
  opHash: string,
  { initializedAt, fromBlockLevel, signal }: ConfirmOperationOptions = {}
): Promise<OperationEntry> => {
  if (!initializedAt) {
    initializedAt = Date.now();
  }

  if (initializedAt && initializedAt + CONFIRM_TIMEOUT < Date.now()) {
    throw new ConfirmationTimeoutError();
  }

  const startedAt: number = Date.now();
  let currentBlockLevel: number;

  try {
    const currentBlock = await tezos.rpc.getBlock();

    currentBlockLevel = currentBlock.header.level;

    for (let i: number = fromBlockLevel ?? currentBlockLevel; i <= currentBlockLevel; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const block = i === currentBlockLevel ? currentBlock : await tezos.rpc.getBlock({ block: i });
      const opEntry = findOperation(block, opHash);

      if (opEntry) {
        return opEntry;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }

  if (signal?.aborted) {
    throw new ConfirmPollingCanceledError();
  }

  const timeToWait: number = Math.max(startedAt + SYNC_INTERVAL - Date.now(), 0);

  await new Promise(r => setTimeout(r, timeToWait));

  return confirmOperation(tezos, opHash, {
    initializedAt,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fromBlockLevel: currentBlockLevel ? currentBlockLevel + 1 : fromBlockLevel,
    signal
  });
};
