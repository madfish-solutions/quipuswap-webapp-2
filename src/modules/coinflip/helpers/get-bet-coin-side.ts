import { isExist } from '@shared/helpers';
import { Optional } from '@shared/types';

import { BetCoinSide } from '../interfaces';

export enum BetCoinSides {
  head = 'head',
  tail = 'tail'
}

export const getBetCoinSide = (betCoinSide: Optional<BetCoinSide>) => {
  const isResultHead = isExist(betCoinSide?.[BetCoinSides.head]);

  if (isResultHead) {
    return BetCoinSides.head;
  }

  const isResultTail = isExist(betCoinSide?.[BetCoinSides.tail]);

  if (isResultTail) {
    return BetCoinSides.tail;
  }

  return null;
};
