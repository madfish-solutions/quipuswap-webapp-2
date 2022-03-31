import React, { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import s from './alarm-message.module.scss';

interface Props {
  message: string;
  className?: string;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const AlarmMessage: FC<Props> = ({ message, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return <div className={cx(className, s.alarmMessage, themeClass[colorThemeMode])}>{message}</div>;
};
