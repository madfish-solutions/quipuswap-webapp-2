import { useState } from 'react';

export const useSwitcherViewModel = () => {
  const [state, setState] = useState(false);

  const handleClick = (callback: (state: boolean) => void) => {
    if (state === true) {
      setState(false);
      callback(false);
    } else {
      setState(true);
      callback(true);
    }
  };

  return {
    state,
    handleClick
  };
};
