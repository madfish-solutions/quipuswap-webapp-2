import { useCallback, useEffect, useRef } from 'react';
import { UpdateOptions, toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function useUpdateToast() {
  const toastIdRef = useRef<string | number>();
  const prevRouteRef = useRef<string>();
  const router = useRouter();

  useEffect(() => {
    if (prevRouteRef.current && prevRouteRef.current !== router.pathname) {
      toastIdRef.current = undefined;
    }
    prevRouteRef.current = router.pathname;
  }, [router.pathname]);

  return useCallback(({
    type,
    render,
    progress,
    autoClose = 5000,
    ...restOptions
  }: UpdateOptions) => {
    const creationFn = type && type !== 'default' ? toast[type] : toast;
    if (toastIdRef.current && toast.isActive(toastIdRef.current)) {
      toast.update(toastIdRef.current, {
        render,
        type,
        progress,
        autoClose,
        ...restOptions,
      });
    } else {
      toastIdRef.current = creationFn(render);
    }
  }, []);
}
