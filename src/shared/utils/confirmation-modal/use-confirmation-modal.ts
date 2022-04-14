import { ReactNode, useCallback, useState } from 'react';

import constate from 'constate';
import { noop } from 'rxjs';

import { useSingleModalState } from '@shared/hooks';
import { Nullable, Undefined } from '@shared/types';
import { useTranslation } from '@translation';

interface OpenConfirmationModal {
  title?: Undefined<ReactNode>;
  message: Undefined<ReactNode>;
  yesButtonText?: Undefined<ReactNode>;
  noButtonText?: Undefined<ReactNode>;
  yesCallback?: () => Promise<void>;
  noCallback?: () => Promise<void>;
}

export const [ConfirmationModalConstateProvider, useConfirmationModal] = constate(() => {
  const { t } = useTranslation();

  const [title, setTitle] = useState<Nullable<ReactNode>>(null);
  const [message, setMessage] = useState<Nullable<ReactNode>>(null);
  const [yesButtonText, setYesButtonText] = useState<Nullable<ReactNode>>(null);
  const [noButtonText, setNoButtonText] = useState<Nullable<ReactNode>>(null);
  const [{ yesCallback }, setYesCallback] = useState({ yesCallback: noop });
  const [{ noCallback }, setNosCallback] = useState({ noCallback: noop });

  const { isOpen: confirmationModalOpen, open: openModal, close: closeConfirmationModal } = useSingleModalState();

  const openConfirmationModal = useCallback(
    ({
      title: _title = t('common|areYouSure'),
      message: _message = t('farm|confirmationUpdateStake'),
      yesButtonText: _yesButtonText = t('common|no'),
      noButtonText: _noButtonText = t('common|yes'),
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
    [openModal, t]
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
