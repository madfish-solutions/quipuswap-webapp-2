import { FC, useContext } from 'react';

import { Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { NetworkSelect } from '@components/ui/components';
import { Button } from '@components/ui/elements/button';

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

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.wallet}>
        <ConnectWalletButton className={s.button} />
        <NetworkSelect className={cx(s.button, s.select)} />
      </div>
      <Navigation className={s.navigation} iconId="desktop" />
      <footer className={s.footer}>
        <QPToken className={s.footerItem} id="desktop" />
        <Socials className={s.footerItem} id="desktop" />
        <Button className={s.footerItem} href="https://www.madfish.solutions/" external theme="clean">
          <Madfish />
        </Button>
        <Button external href="https://v1.quipuswap.com/" theme="secondary" className={s.button}>
          {t('common|Old version')}
        </Button>
      </footer>
    </div>
  );
};
