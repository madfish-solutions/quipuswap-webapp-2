import { useCallback } from 'react';

import { captureException } from '@sentry/react';
import { ToastContent, UpdateOptions } from 'react-toastify';

import { i18n } from '@translation';

import { useUpdateToast } from './use-update-toast';

export interface UseToasts {
  updateToast: ({ type, render, progress, autoClose, ...restOptions }: UpdateOptions) => void;
  showErrorToast: (error: Error | string) => void;
  showSuccessToast: (render: ToastContent) => void;
  showInfoToast: (render: ToastContent) => void;
  showRichTextErrorToast: (error: Error | string, render: ToastContent) => void;
}

const knownErrorsMessages = {
  'Dex/high-min-out': i18n.t('common|highMinOutError'),
  '503 Service Temporarily Unavailable': 'The server is temporarily unavailable.',
  'Permission Not Granted': 'You rejected the operation.'
};

const getErrorMessage = (error: Error | object | string) => {
  const errorMessage = typeof error === 'string' ? error : `${JSON.stringify(error)}`;

  const foundKey = Object.keys(knownErrorsMessages).find(key =>
    errorMessage.includes(key)
  ) as keyof typeof knownErrorsMessages;

  if (foundKey) {
    return knownErrorsMessages[foundKey];
  }
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return errorMessage;
};

export const useToasts = (): UseToasts => {
  const updateToast = useUpdateToast();

  const showErrorToast = useCallback(
    (error: Error | string) => {
      const errorMessage = getErrorMessage(error);

      captureException(error instanceof Error ? error : new Error(errorMessage));

      updateToast({
        type: 'error',
        render: errorMessage
      });
    },
    [updateToast]
  );

  const showRichTextErrorToast = useCallback(
    (error: Error | string, render: ToastContent) => {
      captureException(error instanceof Error ? error : new Error(error));
      updateToast({ type: 'error', render });
    },
    [updateToast]
  );

  const showInfoToast = useCallback(
    (render: ToastContent) => {
      updateToast({
        type: 'info',
        render
      });
    },
    [updateToast]
  );

  const showSuccessToast = useCallback(
    (render: ToastContent) => {
      updateToast({
        type: 'success',
        render
      });
    },
    [updateToast]
  );

  return {
    updateToast,
    showInfoToast,
    showSuccessToast,
    showErrorToast,
    showRichTextErrorToast
  };
};
