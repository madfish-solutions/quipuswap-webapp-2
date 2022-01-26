import { useEffect, useRef } from 'react';

import { ColorModes } from '@quipuswap/ui-kit';

export const usePrevious = (value: ColorModes) => {
  const ref = useRef();
  useEffect(() => {
    // @ts-ignore
    ref.current = value;
  });

  return ref.current;
};
