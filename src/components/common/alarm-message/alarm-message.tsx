import React, { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import s from './alarm-message.module.sass';

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

  const compoundClassName = cx(className, s.alarmMessage, themeClass[colorThemeMode]);

  return <div className={compoundClassName}>{message}</div>;
};
