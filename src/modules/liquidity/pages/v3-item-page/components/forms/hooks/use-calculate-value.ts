import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { isEqual, isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { useCalculateInputAmountValue } from './use-calculate-input-amount-value';
import { useCurrentTick } from './use-current-tick';
import { usePositionTicks } from './use-position-ticks';
import { V3AddTokenInput } from '../interface';

const MAX_COUNT_OF_INPUTS = 2;
const ZERO_AMOUNT_STR = String(ZERO_AMOUNT);

export const useCalculateValue = () => {
  const { lowerTick, upperTick } = usePositionTicks();
  const currentTick = useCurrentTick();
  const calculateInputAmountValue = useCalculateInputAmountValue();

  const calculateValue = (localInput: V3AddTokenInput, inputAmount: string, tokens: Array<Nullable<Token>>) => {
    if (isNull(currentTick) || isNull(upperTick) || isNull(lowerTick)) {
      return ZERO_AMOUNT_STR;
    }

    return isEqual(tokens.length, MAX_COUNT_OF_INPUTS)
      ? calculateInputAmountValue(localInput, currentTick, upperTick, lowerTick, new BigNumber(inputAmount))
      : ZERO_AMOUNT_STR;
  };

  return { calculateValue };
};
