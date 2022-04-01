import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './alarm-message.module.scss';

interface Props {
  message: string;
  className?: string;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const AlarmMessage: FC<Props> = ({ message, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return <div className={cx(className, styles.alarmMessage, themeClass[colorThemeMode])}>{message}</div>;
};
