import { useTranslation } from 'react-i18next';
import { ToastContent, UpdateOptions } from 'react-toastify';

import useUpdateToast from './useUpdateToast';

export interface UseFlowToasts {
  updateToast: ({ type, render, progress, autoClose, ...restOptions }: UpdateOptions) => void;
  showErrorToast: (err: Error | string) => void;
  showLoaderToast: () => void;
  showSuccessToast: (render?: ToastContent) => void;
}

export const useFlowToasts = (): UseFlowToasts => {
  const updateToast = useUpdateToast();
  const { t } = useTranslation(['common']);

  const showErrorToast = (err: Error | string) => {
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
  };

  const showLoaderToast = () => {
    updateToast({
      type: 'info',
      render: t('common|Loading')
    });
  };

  const showSuccessToast = (render?: ToastContent) => {
    updateToast({
      type: 'success',
      render
    });
  };

  return { updateToast, showLoaderToast, showSuccessToast, showErrorToast };
};
