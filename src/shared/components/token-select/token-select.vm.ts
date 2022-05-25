import { useCallback, useMemo, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { amountsAreEqual } from '@shared/helpers';
import { Token, Undefined } from '@shared/types';

interface Props {
  amount: Undefined<BigNumber>;
  onAmountChange: (value: Undefined<BigNumber>) => void;
  onTokenChange: (token: Token) => void;
}

const numberAsString = (value: string) => value.replace(/ /g, '').replace(/,/g, '.');
const isValidValue = (value: BigNumber) => !value.isNaN() && value.gte(0);

export const useTokenSelectViewModel = ({ amount, onAmountChange, onTokenChange }: Props) => {
  const [tokensModal, setTokensModal] = useState(false);
  const openTokenModal = useCallback(() => setTokensModal(true), []);
  const closeTokenModal = useCallback(() => setTokensModal(false), []);

  const amountStr = useMemo(() => (amount === undefined ? '' : new BigNumber(amount).toFixed()), [amount]);

  const [localAmount, setLocalAmount] = useState(amountStr);

  const handleAmountChangeIfNeeded = useCallback(
    (newAmount: Undefined<BigNumber>) => {
      if (!amountsAreEqual(newAmount, amount)) {
        onAmountChange(newAmount);
      }
    },
    [amount, onAmountChange]
  );

  const handleAmountChange = useCallback(
    (value: string) => {
      const val = numberAsString(value);
      const numVal = new BigNumber(val || 0);

      if (isValidValue(numVal)) {
        setLocalAmount(val);
        handleAmountChangeIfNeeded(val === '' ? undefined : numVal);
      }
    },
    [handleAmountChangeIfNeeded]
  );

  const handleTokenChange = useCallback(
    (selectedToken: Token) => {
      setTokensModal(false);
      const val = numberAsString(localAmount);
      const numVal = new BigNumber(val || 0);
      if (isValidValue(numVal) && val !== '') {
        setLocalAmount(numVal.decimalPlaces(selectedToken.metadata.decimals).toFixed());
      }
      onTokenChange(selectedToken);
    },
    [localAmount, onTokenChange]
  );

  return {
    tokensModal,
    openTokenModal,
    closeTokenModal,

    localAmount,

    handleAmountChange,
    handleTokenChange
  };
};
