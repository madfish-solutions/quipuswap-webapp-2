import { ChangeEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { getMessageNotWhitelistedTokenPair, getTokenInputAmountCap } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { Nullable } from '@shared/types';

import { TokenInputViewModelProps } from './types';

export const useTokenInputViewModel = ({
  tokens,
  hiddenBalance,
  readOnly,
  hiddenPercentSelector,
  hiddenNotWhitelistedMessage,
  onInputChange,
  onBlur
}: TokenInputViewModelProps) => {
  const { accountPkh } = useAuthStore();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<[Nullable<number>, Nullable<number>] | null>(null);

  useLayoutEffect(() => {
    if (selection && inputRef.current) {
      [inputRef.current.selectionStart, inputRef.current.selectionEnd] = selection;
    }
  }, [selection]);

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const focusInput = () => {
    inputRef?.current?.focus();
  };

  const notWhitelistedMessage = useMemo(
    () => (hiddenNotWhitelistedMessage ? null : getMessageNotWhitelistedTokenPair(tokens)),
    [tokens, hiddenNotWhitelistedMessage]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
    setSelection([event.target.selectionStart, event.target.selectionEnd]);
  };

  const handlePercentageSelect = (result: string) => {
    onInputChange(new BigNumber(result).toFixed());
  };

  const amountCap = !Array.isArray(tokens) ? getTokenInputAmountCap(tokens) : undefined;
  const isFormReady = !readOnly;
  const shownPercentSelector = !hiddenPercentSelector && isFormReady;
  const shownBalance = Boolean(accountPkh) && !hiddenBalance && Boolean(tokens);

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
