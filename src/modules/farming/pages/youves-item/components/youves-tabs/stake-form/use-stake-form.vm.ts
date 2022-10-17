import { useState } from 'react';

import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';

export const useStakeFormViewModel = () => {
  const [inputAmount, inputAmountChange] = useState('');

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  return {
    inputAmount,
    handleSubmit,
    userTokenBalance: new BigNumber(10),
    tokens: [QUIPU_TOKEN, TEZOS_TOKEN],
    handleInputAmountChange: inputAmountChange,
    disabled: false,
    isSubmitting: false
  };
};
