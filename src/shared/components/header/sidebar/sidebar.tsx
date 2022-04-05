import { FC, useContext } from 'react';

import cx from 'classnames';

import { IS_NETWORK_MAINNET } from '@config/config';
import { QUIPUSWAP_OLD_VERSION_LINK } from '@config/enviroment';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DonationButton } from '@shared/components';
import { useTranslation } from '@translation';

import { Madfish } from '../../../svg';
import { Button } from '../../button';
import { ConnectWalletButton } from '../../connect-wallet-button';
import { NetworkSelect } from '../../network-select';
import { Navigation } from '../navigation';
import { QPToken } from '../qp-token';
import { Socials } from '../socials';
import styles from './sidebar.module.scss';

interface SidebarProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <div className={styles.wallet}>
        {IS_NETWORK_MAINNET && <DonationButton className={styles.button} />}
        <ConnectWalletButton className={styles.button} />
        <NetworkSelect className={cx(styles.button, styles.select)} />
      </div>
      <Navigation className={styles.navigation} iconId="desktop" />
      <footer className={styles.footer}>
        <QPToken className={styles.footerItem} id="desktop" />
        <Socials className={styles.footerItem} id="desktop" />
        <Button className={styles.footerItem} href="https://www.madfish.solutions/" external theme="clean">
          <Madfish />
        </Button>
        <Button external href={QUIPUSWAP_OLD_VERSION_LINK} theme="secondary" className={styles.button}>
          {t('common|Old version')}
        </Button>
      </footer>
    </div>
  );
};
