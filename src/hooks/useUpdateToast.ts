import { useCallback, useEffect, useRef } from 'react';

import { toastContent } from '@quipuswap/ui-kit';
import { useLocation } from 'react-router-dom';
import { UpdateOptions, toast } from 'react-toastify';

// eslint-disable-next-line import/no-default-export
export default function useUpdateToast() {
  const toastIdRef = useRef<string | number>();
  const prevRouteRef = useRef<string>();
  const location = useLocation();

  useEffect(() => {
    if (prevRouteRef.current && prevRouteRef.current !== location.pathname) {
      toastIdRef.current = undefined;
    }
    prevRouteRef.current = location.pathname;
  }, [location.pathname]);

  return useCallback(({ type, render, progress, autoClose = 5000, ...restOptions }: UpdateOptions) => {
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
  }, []);
}
