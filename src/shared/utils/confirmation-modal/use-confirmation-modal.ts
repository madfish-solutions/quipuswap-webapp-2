import { ReactNode, useCallback, useState } from 'react';

import constate from 'constate';
import { noop } from 'rxjs';

import { useSingleModalState } from '@shared/hooks';
import { Nullable } from '@shared/types';

export const [ConfirmationModalConstateProvider, useConfirmationModal] = constate(() => {
  const [message, setMessage] = useState<Nullable<ReactNode>>(null);
  const [{ yesCallback }, setYesCallback] = useState({ yesCallback: noop });

  const { isOpen: confirmationModalOpen, open: openModal, close: closeConfirmationModal } = useSingleModalState();

  const openConfirmationModal = useCallback(
    (message: ReactNode, callback: () => Promise<void>) => {
      setMessage(message);
      setYesCallback({ yesCallback: callback });

      openModal();
    },
    [openModal]
  );

  return {
    message,
    yesCallback,
    confirmationModalOpen,
    openConfirmationModal,
    closeConfirmationModal
  };
});
