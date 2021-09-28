import React, {
  useContext, useState, useMemo, useEffect,
} from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Timeleft.module.sass';

type TimeleftProps = {
  remaining: Date
  className?: string
  showSeconds?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

// TODO: change to timeago.js
const timeDiffCalc = (dateFuture:number, dateNow:number) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  // calculate minutes
  const seconds = Math.floor(diffInMilliSeconds / 1) % 60;
  diffInMilliSeconds -= minutes * 60;

  return {
    days, hours, minutes, seconds,
  };
};

export const Timeleft: React.FC<TimeleftProps> = ({
  remaining,
  className,
  showSeconds = false,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [currentDate, setDate] = useState<Date>(remaining);
  const {
    days, hours, minutes, seconds,
  } = useMemo(
    () => timeDiffCalc(Date.now(), currentDate.getTime()),
    [currentDate],
  );
  const compoundClassName = cx(
    s.label,
    modeClass[colorThemeMode],
    className,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const diff = currentDate.getTime() - 1;
      setDate(new Date(diff < Date.now() ? Date.now() : diff));
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentDate]);

  return (
    <div className={compoundClassName}>
      {days}
      <span className={s.span}>D</span>
      {' '}
      {hours}
      <span className={s.span}>H</span>
      {' '}
      {minutes}
      {showSeconds && (
      <>
        {' '}
        {seconds}
        <span className={s.span}>S</span>
      </>
      )}
    </div>
  );
};
