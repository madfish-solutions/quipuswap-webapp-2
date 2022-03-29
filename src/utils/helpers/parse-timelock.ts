import BigNumber from 'bignumber.js';

import { SECONDS_IN_MINUTE, MS_IN_SECOND, MINUTES_IN_HOUR, HOURS_IN_DAY } from '@app.config';

export const parseTimelock = (timelock: BigNumber.Value, isTimelockInSeconds?: boolean) => {
  let totalMins = new BigNumber(timelock).dividedToIntegerBy(SECONDS_IN_MINUTE);

  if (!isTimelockInSeconds) {
    totalMins = totalMins.dividedToIntegerBy(MS_IN_SECOND);
  }

  const minutes = totalMins.modulo(MINUTES_IN_HOUR);
  const hours = totalMins.dividedToIntegerBy(MINUTES_IN_HOUR).modulo(HOURS_IN_DAY);
  const days = totalMins.dividedToIntegerBy(MINUTES_IN_HOUR * HOURS_IN_DAY);

  return {
    days: days.toNumber(),
    hours: hours.toNumber(),
    minutes: minutes.toNumber()
  };
};
