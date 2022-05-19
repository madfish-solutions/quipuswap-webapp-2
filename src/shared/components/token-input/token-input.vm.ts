import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { getMessageNotWhitelistedTokenPair, getTokenInputAmountCap, multipliedIfPossible } from '@shared/helpers';

import { TokenInputViewModelProps } from './types';

export const useTokenInputViewModel = ({
  value,
  exchangeRate,
  tokens,
  decimals,
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

  const dollarEquivalent = useMemo(() => multipliedIfPossible(value, exchangeRate), [exchangeRate, value]);

  const notWhitelistedMessage = useMemo(() => getMessageNotWhitelistedTokenPair(tokens), [tokens]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

  const handlePercentageSelect = (newValue: string) => {
    const _value = new BigNumber(newValue).decimalPlaces(decimals).toFixed();
    onInputChange(_value);
  };

  const amountCap = !Array.isArray(tokens) ? getTokenInputAmountCap(tokens) : undefined;

  return {
    isFocused,
    inputRef,
    dollarEquivalent,
    notWhitelistedMessage,

    amountCap,

    focusInput,
    handleInputFocus,
    handleInputBlur,

    handleInputChange,
    handlePercentageSelect
  };
};
