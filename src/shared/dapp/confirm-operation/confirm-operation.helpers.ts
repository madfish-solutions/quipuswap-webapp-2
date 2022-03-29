import { BlockResponse, OperationEntry } from '@taquito/rpc';

import { Nullable } from 'types/types';

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
