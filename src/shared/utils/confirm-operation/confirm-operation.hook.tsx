import { useTezos } from '@providers/use-dapp';

import { NoTezosError } from '../../errors/no-tezos.error';
import { useToasts } from '../toasts';
import { confirmOperation } from './confirm-operation.service';
import { ConfirmationSuccessToast, TransactionSendedToast } from './confirm-operation.toast';
import { OperationMessage, OperationEntry } from './confirm-operation.types';

export const useConfirmOperation = () => {
  const { showSuccessToast, showInfoToast, showErrorToast } = useToasts();
  const tezos = useTezos();

  return async (opHash: string, { message }: Partial<OperationMessage> = {}): Promise<OperationEntry> => {
    showInfoToast(<TransactionSendedToast hash={opHash} />);

    try {
      if (!tezos) {
        return Promise.reject(new NoTezosError());
      }
      const operationEntry = await confirmOperation(tezos, opHash);

      showSuccessToast(<ConfirmationSuccessToast hash={operationEntry.hash} message={message} />);

      return operationEntry;
    } catch (error) {
      showErrorToast(error as Error);

      return Promise.reject(error);
    }
  };
};
