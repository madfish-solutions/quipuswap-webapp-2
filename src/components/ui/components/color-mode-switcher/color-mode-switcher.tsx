import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { DarkMode } from '@components/svg/DarkMode';
import { LightMode } from '@components/svg/LightMode';

import styles from './color-mode-switcher.module.sass';

export interface ColorModeSwitcherProps {
  id?: string;
  className?: string;
}

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = ({ id, className }) => {
  const { colorThemeMode, setColorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className)}>
      <button
        type="button"
        className={cx(styles.button, styles.light, { [styles.active]: colorThemeMode === ColorModes.Light })}
        disabled={colorThemeMode === ColorModes.Light}
        onClick={setColorThemeMode}
      >
        <LightMode id={id} className={styles.icon} />
      </button>
      <span className={styles.divider}>/</span>
      <button
        type="button"
        className={cx(styles.button, styles.dark, { [styles.active]: colorThemeMode === ColorModes.Dark })}
        disabled={colorThemeMode === ColorModes.Dark}
        onClick={setColorThemeMode}
      >
        <DarkMode id={id} className={styles.icon} />
      </button>
    </div>
  );
};
