import { FC, useContext } from 'react';

import { Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP_OLD_VERSION_LINK } from '@config/config';

import { Button } from '../../button';
import { ConnectWalletButton } from '../../connect-button';
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
