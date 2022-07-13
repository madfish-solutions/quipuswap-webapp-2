import { Optional } from '@shared/types';

import { Status } from '../interfaces';

enum Statuses {
  won = 'won',
  lost = 'lost',
  started = 'started'
}

export const getGameResult = (status: Optional<Status>) => {
  const isResultWon = Object.hasOwn(status ?? {}, Statuses.won);

  if (isResultWon) {
    return Statuses.won;
  }

  const isResultLost = Object.hasOwn(status ?? {}, Statuses.lost);

  if (isResultLost) {
    return Statuses.lost;
  }

  const isResultStarted = Object.hasOwn(status ?? {}, Statuses.started);

  if (isResultStarted) {
    return Statuses.started;
  }

  return null;
};
