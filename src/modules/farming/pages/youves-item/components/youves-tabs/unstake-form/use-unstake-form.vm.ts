import { useState } from 'react';

import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';

export const useUnstakeFormViewModel = () => {
  const [inputAmount, inputAmountChange] = useState('');

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  return {
    inputAmount,
    isSubmitting: false,
    handleSubmit,
    userTokenBalance: new BigNumber(10),
    disabled: false,
    handleInputAmountChange: inputAmountChange,
    tokens: [QUIPU_TOKEN, TEZOS_TOKEN]
  };
};
