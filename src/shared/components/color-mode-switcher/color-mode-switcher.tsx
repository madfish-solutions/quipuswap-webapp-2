import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import { amplitudeService } from '../../services';
import { DarkMode, LightMode } from '../../svg';
import styles from './color-mode-switcher.module.scss';

export interface ColorModeSwitcherProps {
  id?: string;
  className?: string;
}

export const ColorModeSwitcher: FC<ColorModeSwitcherProps> = ({ id, className }) => {
  const { colorThemeMode, setColorThemeMode } = useContext(ColorThemeContext);

  const idLightMode = colorThemeMode === ColorModes.Light;
  const idDarkMode = colorThemeMode === ColorModes.Dark;

  const handleColorThemeClick = () => {
    amplitudeService.logEvent('COLOR_THEME_CHANGE');
    setColorThemeMode();
  };

  return (
    <div className={cx(styles.root, className)}>
      {idDarkMode ? (
        <button
          type="button"
          className={cx(styles.button, styles.light, { [styles.active]: idLightMode })}
          disabled={idLightMode}
          onClick={handleColorThemeClick}
        >
          <LightMode id={id} className={styles.icon} />
        </button>
      ) : (
        <button
          type="button"
          className={cx(styles.button, styles.dark, { [styles.active]: idDarkMode })}
          disabled={idDarkMode}
          onClick={handleColorThemeClick}
        >
          <DarkMode id={id} className={styles.icon} />
        </button>
      )}
    </div>
  );
};
