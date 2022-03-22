import { useState } from 'react';

export const useSwitcherViewModel = (initialValue: boolean) => {
  const [state, setState] = useState(initialValue);

  const handleClick = (callback: (state: boolean) => void) => {
    setState(!state);
    callback(!state);
  };

  return {
    state,
    handleClick
  };
};
