import { useCallback, useState } from 'react';

import constate from 'constate';

import { useSingleModalState } from '@hooks/use-single-modal-state';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = async () => {};

export const [ConfirmationModalConstateProvider, useConfirmationModal] = constate(() => {
  const [message, setMessage] = useState('');
  const [{ yesCallback }, setYesCallback] = useState({ yesCallback: noop });

  const { isOpen: confirmationModalOpen, open: openModal, close: closeConfirmationModal } = useSingleModalState();

  const openConfirmationModal = useCallback(
    (message: string, callback: () => Promise<void>) => {
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
