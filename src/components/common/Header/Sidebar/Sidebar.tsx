import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { NetworkSelect } from '@components/common/NetworkSelect';
import { OldVersionButton } from '@components/common/OldVersionButton';

import { Navigation } from '../Navigation';
import { Socials } from '../Socials';
import { QPToken } from '../QPToken';
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
        <OldVersionButton className={s.button} />
      </div>
      <Navigation className={s.navigation} iconId="desktop" />
      <footer className={s.footer}>
        <QPToken className={s.token} />
        <Socials className={s.socials} id="desktop" />
      </footer>
    </div>
  );
};
