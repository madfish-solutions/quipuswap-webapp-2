import { useState } from 'react';

export const useSwitcherViewModel = () => {
  const [state, setState] = useState(false);

  const handleClick = (callback: (state: boolean) => void) => {
    setState(!state);
    callback(!state);
  };

  return {
    state,
    handleClick
  };
};
