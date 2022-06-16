import { FormEvent } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN } from '@config/tokens';

import { StableswapFarmFormViewProps } from '../stableswap-farm-form-view';

export const useStakeFormViewModel = (): StableswapFarmFormViewProps => {
  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    return;
  };
  const label = 'Amount';
  const inputAmount = '16';
  const balance = new BigNumber('300');
  const inputAmountError = undefined;
  const tokens = DEFAULT_TOKEN;
  const handleInputAmountChange = (value: string) => {
    return;
  };
  const disabled = false;
  const isSubmitting = false;
  const buttonText = 'Stake';

  return {
    handleSubmit,
    label,
    inputAmount,
    balance,
    inputAmountError,
    tokens,
    handleInputAmountChange,
    disabled,
    isSubmitting,
    buttonText
  };
};
