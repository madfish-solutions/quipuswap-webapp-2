import { useCallback, useMemo } from 'react';

import { captureException } from '@sentry/react';
import { ToastContent, UpdateOptions } from 'react-toastify';

import { SERVER_UNAVAILABLE_ERROR_MESSAGE, SERVER_UNAVAILABLE_MESSAGE } from '@config/constants';
import { useTranslation } from '@translation';

import { useUpdateToast } from './use-update-toast';

export interface UseToasts {
  updateToast: ({ type, render, progress, autoClose, ...restOptions }: UpdateOptions) => void;
  showErrorToast: (error: Error | string) => void;
  showSuccessToast: (render: ToastContent) => void;
  showInfoToast: (render: ToastContent) => void;
  showRichTextErrorToast: (error: Error | string, render: ToastContent) => void;
}

export const useToasts = (): UseToasts => {
  const updateToast = useUpdateToast();

  const { t } = useTranslation();
  const knownErrorsMessages = useMemo<Record<string, string>>(
    () => ({
      'Dex/high-min-out': t('common|highMinOutError')
    }),
    [t]
  );

  const showErrorToast = useCallback(
    (error: Error | string) => {
      if (typeof error === 'string') {
        captureException(new Error(error));

        updateToast({
          type: 'error',
          render: error
        });

        return;
      }

      if (error instanceof Error) {
        captureException(error);

        let knownErrorMessage = knownErrorsMessages[error.message];

        if (error.message.includes(SERVER_UNAVAILABLE_ERROR_MESSAGE)) {
          knownErrorMessage = SERVER_UNAVAILABLE_MESSAGE;
        }

        updateToast({
          type: 'error',
          render: knownErrorMessage ?? `${error.name}: ${error.message}`
        });

        return;
      }

      const errorMessage = `${JSON.stringify(error)}`;
      captureException(new Error(errorMessage));
      updateToast({
        type: 'error',
        render: errorMessage
      });
    },
    [updateToast, knownErrorsMessages]
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
