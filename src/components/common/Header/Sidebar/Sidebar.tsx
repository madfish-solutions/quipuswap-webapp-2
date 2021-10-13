import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { NetworkSelect } from '@components/common/NetworkSelect';
import { Button } from '@components/ui/Button';
import { Madfish } from '@components/svg/Madfish';

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
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.wallet}>
        <ConnectWalletButton className={s.button} />
        <NetworkSelect className={s.button} />
        <Button external href="https://quipuswap.com/" theme="secondary" className={s.button}>
          {t('common|Old version')}
        </Button>
      </div>
      <Navigation className={s.navigation} iconId="desktop" />
      <footer className={s.footer}>
        <QPToken className={s.token} id="desktop" />
        <Socials className={s.socials} id="desktop" />
        <Button
          href="https://www.madfish.solutions/"
          external
          theme="clean"
          className={s.madfish}
        >
          <Madfish />
        </Button>
      </footer>
    </div>
  );
};
