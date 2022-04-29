import { FC, useContext } from 'react';

import cx from 'classnames';

import { IS_NETWORK_MAINNET } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DonationButton } from '@shared/components';

import { amplitudeService } from '../../../services';
import { Madfish } from '../../../svg';
import { Button } from '../../button';
import { ConnectWalletButton } from '../../connect-wallet-button';
import { NetworkSelect } from '../../network-select';
import { Navigation } from '../navigation';
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
  const { colorThemeMode } = useContext(ColorThemeContext);

  const handleMadfishClick = () => {
    amplitudeService.logEvent('MADFISH_CLICK');
  };

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <div className={styles.wallet}>
        {IS_NETWORK_MAINNET && <DonationButton className={styles.button} />}
        <ConnectWalletButton className={styles.button} />
      </div>
      <Navigation className={styles.navigation} iconId="desktop" />
      <footer className={styles.footer}>
        <Socials className={styles.footerItem} id="desktop" />
        <Button
          className={styles.footerItem}
          href="https://www.madfish.solutions/"
          external
          theme="clean"
          onClick={handleMadfishClick}
        >
          <Madfish />
        </Button>

        <div className={styles.networkSelect}>
          <NetworkSelect className={cx(styles.button, styles.select)} menuPlacement="top" />
        </div>
      </footer>
    </div>
  );
};
