import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';
import { NetworkSelect } from '@components/common/NetworkSelect';

import { Navigation } from '../Navigation';
import { Socials } from '../Socials';
import { QPToken } from '../QPToken';
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
      <Navigation className={s.navigation} />
      <footer className={s.footer}>
        <div className={s.row}>
          <QPToken />
          <NetworkSelect menuPlacement="top" className={s.select} />
        </div>
        <div className={s.row}>
          <ColorModeSwitcher id="mobile" />
          <Socials />
          <LanguageSwitcher direction="up" />
        </div>
      </footer>
    </div>
  );
};
