import { ToastContent } from 'react-toastify';

import { appi18n } from '@app.i18n';

import useUpdateToast from './useUpdateToast';

export const useFlowToasts = () => {
  const updateToast = useUpdateToast();
  const { t } = appi18n;

  const showErrorToast = (err: Error) =>
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`
    });

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

  return { showLoaderToast, showSuccessToast, showErrorToast };
};
