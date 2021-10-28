import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';
import { LightMode } from '@components/svg/LightMode';
import { DarkMode } from '@components/svg/DarkMode';

import s from './ColorModeSwitcher.module.sass';

type ColorModeSwitcherProps = {
  id?: string
  className?: string
};

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = ({
  id,
  className,
}) => {
  const { colorThemeMode, setColorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, className)}>
      <button
        type="button"
        className={cx(
          s.button,
          s.light,
          { [s.active]: colorThemeMode === ColorModes.Light },
        )}
        disabled={colorThemeMode === ColorModes.Light}
        onClick={setColorThemeMode}
      >
        <LightMode id={id} className={s.icon} />
      </button>
      <span className={s.divider}>/</span>
      <button
        type="button"
        className={cx(
          s.button,
          s.dark,
          { [s.active]: colorThemeMode === ColorModes.Dark },
        )}
        disabled={colorThemeMode === ColorModes.Dark}
        onClick={setColorThemeMode}
      >
        <DarkMode id={id} className={s.icon} />
      </button>
    </div>
  );
};
