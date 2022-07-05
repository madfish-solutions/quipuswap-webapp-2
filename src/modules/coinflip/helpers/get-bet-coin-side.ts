import { Optional } from '@shared/types';

import { BetCoinSide } from '../interfaces';

enum BetCoinSides {
  head = 'head',
  tail = 'tail'
}

enum BetCoinSidesFrontEnd {
  head = 'Face',
  tail = 'Back'
}

export const getBetCoinSide = (betCoinSide: Optional<BetCoinSide>) => {
  const isResultHead = Object.hasOwn(betCoinSide ?? {}, BetCoinSides.head);

  if (isResultHead) {
    return BetCoinSidesFrontEnd.head;
  }

  const isResultTail = Object.hasOwn(betCoinSide ?? {}, BetCoinSides.tail);

  if (isResultTail) {
    return BetCoinSidesFrontEnd.tail;
  }

  return null;
};
