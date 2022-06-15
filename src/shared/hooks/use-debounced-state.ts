import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { debounce } from 'throttle-debounce';

export function useDebouncedState<T>(delay: number): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export function useDebouncedState<T>(delay: number, value: T): [T, Dispatch<SetStateAction<T>>];
export function useDebouncedState<T>(delay: number, value?: T) {
  const [debouncedValue, setValue] = useState(value);
  const debouncedSetValue = useMemo(() => debounce(delay, setValue), [delay]);

  return [debouncedValue, debouncedSetValue];
}
