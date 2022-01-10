import { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import s from './inline-loading.module.scss';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const InlineLoading = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s['inline-loading'], modeClass[colorThemeMode])}>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
    </div>
  );
};
