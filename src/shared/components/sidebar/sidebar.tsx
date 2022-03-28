import { FC, useContext } from 'react';

import { Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { IS_NETWORK_MAINNET, QUIPUSWAP_OLD_VERSION_LINK } from '@app.config';
import { ConnectWalletButton } from '../connect-wallet-button';
import { DonationButton } from '../donation-button';
import { NetworkSelect } from '../network-select';
import { Button } from '../button';

import { Navigation } from '../navigation';
import { QPToken } from '../QPToken';
import { Socials } from '../socials';
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
        {IS_NETWORK_MAINNET && <DonationButton className={s.button} />}
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
        <Button external href={QUIPUSWAP_OLD_VERSION_LINK} theme="secondary" className={s.button}>
          {t('common|Old version')}
        </Button>
      </footer>
    </div>
  );
};
