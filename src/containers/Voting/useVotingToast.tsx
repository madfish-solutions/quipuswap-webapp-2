import useUpdateToast from '@hooks/useUpdateToast';
import { useCallback } from 'react';

export const useVotingToast = () => {
  const updateToast = useUpdateToast();

  const handleErrorToast = useCallback(
    (err) => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`,
      });
    },
    [updateToast],
  );

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: 'Loading',
    });
  }, [updateToast]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: 'Withdrawal completed!',
    });
  }, [updateToast]);

  return {
    updateToast,
    handleErrorToast,
    handleLoader,
    handleSuccessToast,
  };
};
