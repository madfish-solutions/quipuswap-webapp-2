import { FC, useEffect } from 'react';

import useCountDown from 'react-countdown-hook';

import { TimespanView, TimespanViewProps } from './timespan-view';

interface Props extends Omit<TimespanViewProps, 'value'> {
  /**
   * Timestamp of countdown end in ms
   */
  endTimestamp: number;
}

const COUNTDOWN_REFRESH_INTERVAL = 1000;

const getTimeout = (endTimestamp: number) => Math.max(endTimestamp - Date.now(), 0);

export const Countdown: FC<Props> = ({ endTimestamp, ...restProps }) => {
  const [timeLeft, { start }] = useCountDown(getTimeout(endTimestamp), COUNTDOWN_REFRESH_INTERVAL);

  useEffect(() => {
    start(getTimeout(endTimestamp));
  }, [start, endTimestamp]);

  return <TimespanView {...restProps} value={timeLeft} />;
};
