import { useCallback } from 'react';

import { UpdateOptions } from 'react-toastify';

import useUpdateToast from '@hooks/useUpdateToast';

export interface IUseVotingToast {
  updateToast: ({ type, render, progress, autoClose, ...restOptions }: UpdateOptions) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleErrorToast: (err: any) => void;
  handleLoader: () => void;
  handleSuccessToast: () => void;
}

export const useVotingToast = (): IUseVotingToast => {
  const updateToast = useUpdateToast();

  const handleErrorToast = useCallback(
    err => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`
      });
    },
    [updateToast]
  );

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: 'Loading'
    });
  }, [updateToast]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: 'Withdrawal completed!'
    });
  }, [updateToast]);

  return {
    updateToast,
    handleErrorToast,
    handleLoader,
    handleSuccessToast
  };
};
