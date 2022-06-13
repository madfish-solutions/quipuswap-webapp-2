import { useCallback, useMemo } from 'react';

import { ToastContent, UpdateOptions } from 'react-toastify';

import { isUndefined } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useUpdateToast } from './use-update-toast';

export interface UseToasts {
  updateToast: ({ type, render, progress, autoClose, ...restOptions }: UpdateOptions) => void;
  showErrorToast: (err: Error | string) => void;
  showSuccessToast: (render: ToastContent) => void;
  showInfoToast: (render: ToastContent) => void;
}

export const useToasts = (): UseToasts => {
  const updateToast = useUpdateToast();

  const { t } = useTranslation(['common']);
  const knownErrorsMessages = useMemo<Record<string, string>>(
    () => ({
      'Dex/high-min-out': t('common|highMinOutError')
    }),
    [t]
  );

  const showErrorToast = useCallback(
    (error: Error | string) => {
      if (typeof error === 'string') {
        updateToast({
          type: 'error',
          render: error
        });

        return;
      }

      if (
        typeof error === 'object' &&
        'name' in error &&
        'message' in error &&
        !isUndefined(error.name) &&
        !isUndefined(error.message)
      ) {
        const knownErrorMessage = knownErrorsMessages[error.message];

        updateToast({
          type: 'error',
          render: knownErrorMessage ?? `${error.name}: ${error.message}`
        });

        return;
      }

      updateToast({
        type: 'error',
        render: `${JSON.stringify(error)}`
      });
    },
    [updateToast, knownErrorsMessages]
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
    showErrorToast
  };
};
