import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import s from './inline-loading.module.scss';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface InlineLoadingProps {
  zoom?: number;
}

export const InlineLoading: FC<InlineLoadingProps> = ({ zoom }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s['inline-loading'], modeClass[colorThemeMode])} style={{ transform: `scale(${zoom})` }}>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
    </div>
  );
};
