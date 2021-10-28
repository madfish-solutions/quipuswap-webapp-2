import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';

import s from './Timeleft.module.sass';

type TimeleftProps = {
  remaining: Date
  className?: string
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

  return { days, hours, minutes };
};

export const Timeleft: React.FC<TimeleftProps> = ({
  remaining,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { days, hours, minutes } = timeDiffCalc(Date.now(), remaining.getTime());
  const compoundClassName = cx(
    s.label,
    modeClass[colorThemeMode],
    className,
  );

  return (
    <div className={compoundClassName}>
      {days}
      <span className={s.span}>D</span>
      {' '}
      {hours}
      <span className={s.span}>H</span>
      {' '}
      {minutes}
      <span className={s.span}>M</span>
    </div>
  );
};
