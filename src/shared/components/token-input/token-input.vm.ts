import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { getMessageNotWhitelistedTokenPair, getTokenInputAmountCap } from '@shared/helpers';

import { TokenInputViewModelProps } from './types';

export const useTokenInputViewModel = ({ value, tokens, onInputChange }: TokenInputViewModelProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const focusInput = () => {
    inputRef?.current?.focus();
  };

  const notWhitelistedMessage = useMemo(() => getMessageNotWhitelistedTokenPair(tokens), [tokens]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

  const handlePercentageSelect = (balance: string) => {
    const _value = new BigNumber(balance).toFixed();
    onInputChange(_value);
  };

  const amountCap = !Array.isArray(tokens) ? getTokenInputAmountCap(tokens) : undefined;

  return {
    isFocused,
    inputRef,
    notWhitelistedMessage,

    amountCap,

    focusInput,
    handleInputFocus,
    handleInputBlur,

    handleInputChange,
    handlePercentageSelect
  };
};
