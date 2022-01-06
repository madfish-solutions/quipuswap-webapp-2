import { useToasts } from '@hooks/use-toasts';

import { useTezos } from '..';
import { confirmOperation } from './confirm-operation.service';
import { ConfirmationSuccessToast, TransactionSendedToast } from './confirm-operation.toast';
import { OperationMessage } from './confirm-operation.types';

export const useConfirmOperation = () => {
  const { showSuccessToast, showInfoToast, showErrorToast } = useToasts();
  const tezos = useTezos();

  return async (opHash: string, { message }: Partial<OperationMessage> = {}): Promise<void> => {
    showInfoToast(<TransactionSendedToast hash={opHash} />);

    try {
      const operationEntry = await confirmOperation(tezos!, opHash);

      showSuccessToast(<ConfirmationSuccessToast hash={operationEntry.hash} message={message} />);
    } catch (error) {
      showErrorToast(error as Error);
    }
  };
};
