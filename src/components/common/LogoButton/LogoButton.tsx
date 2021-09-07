import React, { useContext } from 'react';
import Link from 'next/link';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Logo } from '@components/svg/Logo';
import { LogoSmall } from '@components/svg/LogoSmall';

import s from './LogoButton.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LogoButton: React.FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Link href="/">
      <a className={cx(modeClass[colorThemeMode], s.logo)}>
        <LogoSmall className={s.logoImg} />
        <Logo className={s.logoText} />
      </a>
    </Link>
  );
};
