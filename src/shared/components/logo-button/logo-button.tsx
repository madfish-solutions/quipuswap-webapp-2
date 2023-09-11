import { FC, useContext } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import s from './logo-button.module.scss';
import { Logo, LogoSmall } from '../../svg';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface LogoButtonProps {
  href: string;
}

export const LogoButton: FC<LogoButtonProps> = ({ href }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Link className={cx(modeClass[colorThemeMode], s.logo)} to={href} data-test-id="quipuSwapLogoButton">
      <LogoSmall className={s.logoImg} />
      <Logo className={s.logoText} />
    </Link>
  );
};
