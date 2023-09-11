import { TezosToolkit } from '@taquito/taquito';

import { CONFIRM_TIMEOUT, SYNC_INTERVAL } from './confirm-operation.config';
import {
  ConfirmationTimeoutError,
  ConfirmPollingCanceledError,
  OperationRejectedError
} from './confirm-operation.errors';
import { findOperation, getOperationStatus } from './confirm-operation.helpers';
import { ConfirmOperationOptions, OperationEntry } from './confirm-operation.types';

export const confirmOperation = async (
  tezos: TezosToolkit,
  opHash: string,
  { initializedAt, fromBlockLevel, signal }: ConfirmOperationOptions = {}
  // eslint-disable-next-line sonarjs/cognitive-complexity
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
      const block = i === currentBlockLevel ? currentBlock : await tezos.rpc.getBlock({ block: String(i) });
      //@ts-ignore
      const opEntry = findOperation(block, opHash);

      const operationIsRejected = opEntry?.contents.some(
        //@ts-ignore
        operationContents => getOperationStatus(operationContents) === 'failed'
      );

      if (operationIsRejected) {
        throw new OperationRejectedError();
      }

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
