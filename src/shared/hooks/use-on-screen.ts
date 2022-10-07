import { RefObject, useEffect, useMemo, useState } from 'react';

export const useOnScreen = <T extends Element>(ref: RefObject<T>) => {
  const [isVisible, setIsVisible] = useState(false);

  const observer = useMemo(() => new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting)), []);

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [observer, ref]);

  return isVisible;
};
