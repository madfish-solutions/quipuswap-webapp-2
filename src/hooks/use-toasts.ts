import { useCallback } from 'react';

import { ToastContent, UpdateOptions } from 'react-toastify';

import { useUpdateToast } from './useUpdateToast';

export interface UseToasts {
  updateToast: ({ type, render, progress, autoClose, ...restOptions }: UpdateOptions) => void;
  showErrorToast: (err: Error | string) => void;
  showSuccessToast: (render: ToastContent) => void;
  showInfoToast: (render: ToastContent) => void;
}

export const useToasts = (): UseToasts => {
  const updateToast = useUpdateToast();

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
