import { TezosToolkit } from '@taquito/taquito';

import { useToasts } from '@hooks/use-toasts';

import { confirmOperation } from './confirm-operation.service';
import { ConfirmationSuccessToast, TransactionSendedToast } from './confirm-operation.toast';
import { ConfirmOperationOptions, OperationMessage } from './confirm-operation.types';

export const useConfirmOperation = () => {
  const { showSuccessToast, showInfoToast, showErrorToast } = useToasts();

  return async (
    tezos: TezosToolkit,
    opHash: string,
    options: ConfirmOperationOptions = {},
    { message }: Partial<OperationMessage>
  ): Promise<void> => {
    showInfoToast(<TransactionSendedToast hash={opHash} />);

    try {
      const operationEntry = await confirmOperation(tezos, opHash, options);

      showSuccessToast(<ConfirmationSuccessToast hash={operationEntry.hash} message={message} />);
    } catch (error) {
      showErrorToast(error as Error);
    }
  };
};
