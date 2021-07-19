import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { NetworkSelect } from '@components/common/NetworkSelect';
import Token from '@icons/Token.svg';

import { Navigation } from '../Header/Navigation';
import { Socials } from '../Header/Socials';
import s from './Sidebar.module.sass';

type SidebarProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Sidebar: React.FC<SidebarProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.wallet}>
        <ConnectWalletButton className={s.button} />
        <NetworkSelect className={s.button} />
      </div>
      <Navigation className={s.navigation} iconId="desktop" />
      <footer className={s.footer}>
        <div className={s.token}>
          <Token className={s.tokenIcon} />
          <span className={s.price}>$ 5.34</span>
        </div>
        <Socials className={s.socials} id="desktop" />
      </footer>
    </div>
  );
};
