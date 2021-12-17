import { useTranslation } from 'react-i18next';
import { ToastContent } from 'react-toastify';

import useUpdateToast from './useUpdateToast';

export const useFlowToasts = () => {
  const updateToast = useUpdateToast();
  const { t } = useTranslation(['common']);

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
