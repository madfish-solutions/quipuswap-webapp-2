import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { ToastContent, UpdateOptions } from 'react-toastify';

import useUpdateToast from './useUpdateToast';

export interface UseToasts {
  updateToast: ({ type, render, progress, autoClose, ...restOptions }: UpdateOptions) => void;
  showErrorToast: (err: Error | string) => void;
  showLoaderToast: () => void;
  showSuccessToast: (render?: ToastContent) => void;
  showInfoToast: (render?: ToastContent) => void;
}

export const useToasts = (): UseToasts => {
  const updateToast = useUpdateToast();
  const { t } = useTranslation(['common']);

  const showErrorToast = useCallback(
    (err: Error | string) => {
      if (err instanceof Error) {
        updateToast({
          type: 'error',
          render: `${err.name}: ${err.message}`
        });
      }
      if (typeof err === 'string') {
        updateToast({
          type: 'error',
          render: err
        });
      }
    },
    [updateToast]
  );

  const showLoaderToast = () => {
    updateToast({
      type: 'info',
      render: t('common|Loading')
    });
  };

  const showInfoToast = (render?: ToastContent) => {
    updateToast({
      type: 'info',
      render
    });
  };

  const showSuccessToast = (render?: ToastContent) => {
    updateToast({
      type: 'success',
      render
    });
  };

  return {
    updateToast,
    showInfoToast,
    showLoaderToast,
    showSuccessToast,
    showErrorToast
  };
};
