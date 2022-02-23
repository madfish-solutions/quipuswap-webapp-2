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
    (error: Error | string) => {
      if (typeof error === 'string') {
        updateToast({
          type: 'error',
          render: error
        });

        return;
      }

      if (typeof error === 'object' && ('name' in error || 'message' in error)) {
        updateToast({
          type: 'error',
          render: `${error.name}: ${error.message}`
        });

        return;
      }

      updateToast({
        type: 'error',
        render: `${JSON.stringify(error)}`
      });
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
