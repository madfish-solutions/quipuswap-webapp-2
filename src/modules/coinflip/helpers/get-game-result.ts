import { isExist } from '@shared/helpers';
import { Optional } from '@shared/types';

import { Status } from '../interfaces';

export enum Statuses {
  won = 'won',
  lost = 'lost',
  started = 'started'
}

export const getGameResult = (status: Optional<Status>) => {
  const isResultWon = isExist(status?.[Statuses.won]);

  if (isResultWon) {
    return Statuses.won;
  }

  const isResultLost = isExist(status?.[Statuses.lost]);

  if (isResultLost) {
    return Statuses.lost;
  }

  const isResultStarted = isExist(status?.[Statuses.started]);

  if (isResultStarted) {
    return Statuses.started;
  }

  return null;
};
