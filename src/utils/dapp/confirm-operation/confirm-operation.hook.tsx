import { TezosToolkit } from '@taquito/taquito';

import { useFlowToasts } from '@hooks/use-flow-toasts';

import { confirmOperation } from './confirm-operation.service';
import { ConfirmOperationOptions } from './confirm-operation.types';
import { ConfirmationSuccessToast, TransactionSendedToast } from './confirm-operations.toast';

export const useConfirmOperation = () => {
  const { showSuccessToast, showInfoToast, showErrorToast } = useFlowToasts();

  return async (tezos: TezosToolkit, opHash: string, options: ConfirmOperationOptions = {}): Promise<void> => {
    showInfoToast(<TransactionSendedToast hash={opHash} />);

    try {
      const operationEntry = await confirmOperation(tezos, opHash, options);

      showSuccessToast(<ConfirmationSuccessToast hash={operationEntry.hash} />);
    } catch (error) {
      showErrorToast(error as Error);
    }
  };
};
