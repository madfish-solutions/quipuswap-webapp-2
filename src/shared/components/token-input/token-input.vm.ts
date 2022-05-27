import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { getMessageNotWhitelistedTokenPair, getTokenInputAmountCap, isExist } from '@shared/helpers';

import { TokenInputViewModelProps } from './types';

export const useTokenInputViewModel = ({
  value,

  tokens,

  balance,
  readOnly,
  hiddenPercentSelector,
  onInputChange
}: TokenInputViewModelProps) => {
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

  const handlePercentageSelect = (result: string) => {
    onInputChange(new BigNumber(result).toFixed());
  };

  const amountCap = !Array.isArray(tokens) ? getTokenInputAmountCap(tokens) : undefined;
  const isFormReady = isExist(balance) && !readOnly;
  const showPercentSelector = !hiddenPercentSelector && isFormReady;

  return {
    isFocused,
    inputRef,
    notWhitelistedMessage,

    isFormReady,
    showPercentSelector,

    amountCap,

    focusInput,
    handleInputFocus,
    handleInputBlur,

    handleInputChange,
    handlePercentageSelect
  };
};
