import { useEffect, useRef } from 'react';

export const useIsMountedRef = () => {
  const ref = useRef(true);

  useEffect(() => {
    return () => void (ref.current = false);
  }, []);

  return ref;
};
