import { OperationContents, OperationContentsAndResult, BlockResponse, OperationEntry } from '@taquito/rpc';

import { Nullable } from '@shared/types';

export const findOperation = (block: BlockResponse, opHash: string): Nullable<OperationEntry> => {
  for (let i = 3; i >= 0; i--) {
    for (const op of block.operations[i]) {
      if (op.hash === opHash) {
        return op;
      }
    }
  }

  return null;
};

export const getOperationStatus = (operationContents: OperationContents | OperationContentsAndResult) =>
  'metadata' in operationContents && 'operation_result' in operationContents.metadata
    ? operationContents.metadata.operation_result.status
    : null;
