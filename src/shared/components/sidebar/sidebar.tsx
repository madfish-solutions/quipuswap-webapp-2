import { FC, useContext } from 'react';

import { Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { IS_NETWORK_MAINNET, QUIPUSWAP_OLD_VERSION_LINK } from '@config';
import { ConnectWalletButton } from '@shared/components/connect-wallet-button';
import { DonationButton } from '@shared/components/donation-button';
import { NetworkSelect } from '@shared/components/network-select';
import { Button } from '@shared/components/button';

import { Navigation } from '@shared/components/navigation';
import { QPToken } from '@shared/components/QPToken';
import { Socials } from '@shared/components/socials';
import s from './Sidebar.module.sass';

interface SidebarProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Sidebar: FC<SidebarProps> = ({ className }) => {
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
