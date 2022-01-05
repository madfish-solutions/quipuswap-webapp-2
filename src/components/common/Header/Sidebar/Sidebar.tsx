import React, { useContext } from 'react';

import { Button, Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { appi18n } from '@app.i18n';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { NetworkSelect } from '@components/common/NetworkSelect';

import { Navigation } from '../Navigation';
import { QPToken } from '../QPToken';
import { Socials } from '../Socials';
import s from './Sidebar.module.sass';

interface SidebarProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { t } = appi18n;
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.wallet}>
        <ConnectWalletButton className={s.button} />
        <NetworkSelect menuPlacement="top" className={s.button} />
        <Button external href="https://quipuswap.com/" theme="secondary" className={s.button}>
          {t('common|Old version')}
        </Button>
      </div>
      <Navigation className={s.navigation} iconId="desktop" />
      <footer className={s.footer}>
        <QPToken className={s.token} id="desktop" />
        <Socials className={s.socials} id="desktop" />
        <Button href="https://www.madfish.solutions/" external theme="clean" className={s.madfish}>
          <Madfish />
        </Button>
      </footer>
    </div>
  );
};
