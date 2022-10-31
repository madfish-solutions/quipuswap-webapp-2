import { TransactionOperation, TransactionWalletOperation } from '@taquito/taquito';

type Operation = TransactionOperation | TransactionWalletOperation;

export const getOperationHash = (operation: Operation) => {
  if (operation instanceof TransactionOperation) {
    return operation.hash;
  } else if (operation instanceof TransactionWalletOperation) {
    return operation.opHash;
  }

  return null;
};
