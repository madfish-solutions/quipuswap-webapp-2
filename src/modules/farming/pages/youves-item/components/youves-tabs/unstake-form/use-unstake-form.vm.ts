import { useState } from 'react';

import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';

import { useYouvesUnstakeConfirmationPopup } from './use-unstake-confirmation-popup';

export const useUnstakeFormViewModel = () => {
  const confirmationPopup = useYouvesUnstakeConfirmationPopup();
  const [inputAmount, inputAmountChange] = useState('');

  const handleSubmit = (e: React.FormEvent<unknown>) => {
    e.preventDefault();
    confirmationPopup(async () => {
      // eslint-disable-next-line no-console
      console.log('submit');
    });
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
