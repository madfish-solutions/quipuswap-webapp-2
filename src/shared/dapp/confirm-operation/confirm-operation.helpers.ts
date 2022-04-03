import { BlockResponse, OperationEntry } from '@taquito/rpc';

import { Nullable } from '@shared/types';

const ZERO = 0;

export const findOperation = (block: BlockResponse, opHash: string): Nullable<OperationEntry> => {
  for (let i = 3; i >= ZERO; i--) {
    for (const op of block.operations[i]) {
      if (op.hash === opHash) {
        return op;
      }
    }
  }

  return null;
};
