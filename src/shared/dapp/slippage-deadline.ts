import { useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { DEFAULT_SLIPPAGE_PERCENTAGE, DEFAULT_DEADLINE_MINS } from '@config/config';

const useDeadlineAndSlippage = () => {
  const slippagePresets = useMemo(
    () => [
      { label: '0.5 %', value: '0.5' },
      { label: '1 %', value: '1' },
      { label: '3 %', value: '3' }
    ],
    []
  );
  const deadlinePresets = useMemo(
    () => [
      { label: '30m', value: '30' },
      { label: '1h', value: '60' },
      { label: '3h', value: '180' }
    ],
    []
  );

  const [slippage, setSlippage] = useState(new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));
  const [deadline, setDeadline] = useState(new BigNumber(DEFAULT_DEADLINE_MINS));
  const [slippageActiveButton, setSlippageActiveButton] = useState('0');
  const [deadlineActiveButton, setDeadlineActiveButton] = useState('0');

  return {
    slippage: {
      slippage,
      setSlippage,
      slippageActiveButton,
      setSlippageActiveButton,
      slippagePresets
    },
    deadline: {
      deadline,
      setDeadline,
      deadlineActiveButton,
      setDeadlineActiveButton,
      deadlinePresets
    }
  };
};

export const [DeadlineAndSlippageProvider, useSlippage, useDeadline] = constate(
  useDeadlineAndSlippage,
  v => v.slippage,
  v => v.deadline
);
