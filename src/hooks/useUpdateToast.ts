import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';
import { UpdateOptions, toast } from 'react-toastify';

import { toastContent } from '@components/ui/toast-wrapper';

const DEFAULT_AUTOCLOSE_TIMER = 15000;

export const useUpdateToast = () => {
  const toastIdRef = useRef<string | number>();
  const prevRouteRef = useRef<string>();
  const router = useRouter();

  useEffect(() => {
    if (prevRouteRef.current && prevRouteRef.current !== router.pathname) {
      toastIdRef.current = undefined;
    }
    prevRouteRef.current = router.pathname;
  }, [router.pathname]);

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
