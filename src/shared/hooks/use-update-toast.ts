import { useCallback, useRef } from 'react';

import { UpdateOptions, toast } from 'react-toastify';

import { toastContent } from '@providers';

const DEFAULT_AUTOCLOSE_TIMER = 15000;

export const useUpdateToast = () => {
  const toastIdRef = useRef<string | number>();

  return useCallback(
    ({ type, render, progress, autoClose = DEFAULT_AUTOCLOSE_TIMER, ...restOptions }: UpdateOptions) => {
      const creationFn = type && type !== 'default' ? toast[type] : toast;

      const contentRender = toastContent(render, type);

      if (toastIdRef.current && toast.isActive(toastIdRef.current)) {
        toast.update(toastIdRef.current, {
          render: contentRender,
          type,
          progress,
          autoClose,
          ...restOptions
        });
      } else {
        toastIdRef.current = creationFn(contentRender);
      }
    },
    []
  );
};
