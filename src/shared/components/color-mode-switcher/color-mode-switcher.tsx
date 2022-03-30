import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { DarkMode, LightMode } from '../svg';
import styles from './color-mode-switcher.module.scss';

export interface ColorModeSwitcherProps {
  id?: string;
  className?: string;
}

export const ColorModeSwitcher: FC<ColorModeSwitcherProps> = ({ id, className }) => {
  const { colorThemeMode, setColorThemeMode } = useContext(ColorThemeContext);

  const idLightMode = colorThemeMode === ColorModes.Light;
  const idDarkMode = colorThemeMode === ColorModes.Dark;

  return (
    <div className={cx(styles.root, className)}>
      <button
        type="button"
        className={cx(styles.button, styles.light, { [styles.active]: idLightMode })}
        disabled={idLightMode}
        onClick={setColorThemeMode}
      >
        <LightMode id={id} className={styles.icon} />
      </button>
      <span className={styles.divider}>/</span>
      <button
        type="button"
        className={cx(styles.button, styles.dark, { [styles.active]: idDarkMode })}
        disabled={idDarkMode}
        onClick={setColorThemeMode}
      >
        <DarkMode id={id} className={styles.icon} />
      </button>
    </div>
  );
};
