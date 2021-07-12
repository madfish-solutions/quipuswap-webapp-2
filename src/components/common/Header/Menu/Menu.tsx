import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';

import { Navigation } from '../Navigation';
import { Socials } from '../Socials';
import s from './Menu.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type MenuProps = {
  className?: string
};

export const Menu: React.FC<MenuProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <Navigation />
      <footer className={s.footer}>
        <ColorModeSwitcher id="mobile" />
        <Socials />
        <LanguageSwitcher direction="up" />
      </footer>
    </div>
  );
};
