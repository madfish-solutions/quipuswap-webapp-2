import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { getMessageNotWhitelistedTokenPair, getTokenInputAmountCap } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';

import { TokenInputViewModelProps } from './types';

export const useTokenInputViewModel = ({
  tokens,
  hiddenBalance,
  readOnly,
  hiddenPercentSelector,
  onInputChange
}: TokenInputViewModelProps) => {
  const { accountPkh } = useAuthStore();
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
  const isFormReady = !readOnly;
  const shownPercentSelector = !hiddenPercentSelector && isFormReady;
  const shownBalance = Boolean(accountPkh) && !hiddenBalance;

  return {
    isFocused,
    inputRef,
    notWhitelistedMessage,

    isFormReady,
    shownPercentSelector,
    shownBalance,

    amountCap,

    focusInput,
    handleInputFocus,
    handleInputBlur,

    handleInputChange,
    handlePercentageSelect
  };
};
