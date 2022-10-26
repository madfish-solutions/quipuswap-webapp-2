import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './alarm-message.module.scss';
import { AlarmMessageProps, isPropsWithMessage } from './alarm-message.types';

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const AlarmMessage: FC<AlarmMessageProps> = props => {
  const { className } = props;
  const content = isPropsWithMessage(props) ? props.message : props.children;

  const { colorThemeMode } = useContext(ColorThemeContext);

  return <div className={cx(className, styles.alarmMessage, themeClass[colorThemeMode])}>{content}</div>;
};
