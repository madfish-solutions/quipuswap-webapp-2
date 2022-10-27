import { BigNumber } from 'bignumber.js';

import { HOURS_IN_DAY, MINUTES_IN_HOUR, MS_IN_SECOND, SECONDS_IN_MINUTE } from '@config/constants';
import { i18n } from '@translation';

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

export const getFullTimelockDescription = (timelock: BigNumber.Value, isTimelockInSeconds?: boolean) => {
  const { days, hours, minutes } = parseTimelock(timelock, isTimelockInSeconds);

  return `${days}${i18n.t('common|dayLetter')} ${hours}${i18n.t('common|hourLetter')} ${minutes}${i18n.t(
    'common|minuteLetter'
  )}`;
};

export const getTimeLockDescription = (timelock: BigNumber.Value): string => {
  const ms = Number(timelock) * MS_IN_SECOND;
  const { days } = parseTimelock(ms);

  return `${days} DAYS`;
};
