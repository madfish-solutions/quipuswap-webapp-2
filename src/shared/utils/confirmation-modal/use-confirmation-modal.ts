import { ReactNode, useCallback, useState } from 'react';

import constate from 'constate';
import { noop } from 'rxjs';

import { useSingleModalState } from '@shared/hooks';
import { Nullable } from '@shared/types';

interface OpenConfirmationModal {
  title: ReactNode;
  message: ReactNode;
  yesButtonText: ReactNode;
  noButtonText: ReactNode;
  yesCallback?: () => Promise<void>;
  noCallback?: () => Promise<void>;
}

export const [ConfirmationModalConstateProvider, useConfirmationModal] = constate(() => {
  const [title, setTitle] = useState<Nullable<ReactNode>>(null);
  const [message, setMessage] = useState<Nullable<ReactNode>>(null);
  const [yesButtonText, setYesButtonText] = useState<Nullable<ReactNode>>(null);
  const [noButtonText, setNoButtonText] = useState<Nullable<ReactNode>>(null);
  const [{ yesCallback }, setYesCallback] = useState({ yesCallback: noop });
  const [{ noCallback }, setNosCallback] = useState({ noCallback: noop });

  const { isOpen: confirmationModalOpen, open: openModal, close: closeConfirmationModal } = useSingleModalState();

  const openConfirmationModal = useCallback(
    ({
      title: _title,
      message: _message,
      yesButtonText: _yesButtonText,
      noButtonText: _noButtonText,
      yesCallback: _yesCallback,
      noCallback: _noCallback
    }: OpenConfirmationModal) => {
      setTitle(_title);
      setMessage(_message);
      setYesButtonText(_yesButtonText);
      setNoButtonText(_noButtonText);

      setYesCallback({ yesCallback: _yesCallback ?? noop });
      setNosCallback({ noCallback: _noCallback ?? noop });

      openModal();
    },
    [openModal]
  );

  return {
    title,
    message,
    yesButtonText,
    noButtonText,
    yesCallback,
    noCallback,
    confirmationModalOpen,
    openConfirmationModal,
    closeConfirmationModal
  };
});
