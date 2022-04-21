import { FC, useContext } from 'react';

import cx from 'classnames';

import { IS_NETWORK_MAINNET } from '@config/config';
import { QUIPUSWAP_OLD_VERSION_LINK } from '@config/enviroment';
import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { DonationButton, SettingsButton } from '@shared/components';
import { useTranslation } from '@translation';

import { amplitudeService } from '../../../services';
import { Madfish } from '../../../svg';
import { Button } from '../../button';
import { ColorModeSwitcher } from '../../color-mode-switcher';
import { NetworkSelect } from '../../network-select';
import { Navigation } from '../navigation';
import { QPToken } from '../qp-token';
import { Socials } from '../socials';
import styles from './menu.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface MenuProps {
  className?: string;
}

export const Menu: FC<MenuProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const handleOldVersionClick = () => {
    amplitudeService.logEvent('OLD_VERSION_CLICK');
  };

  const handleMadfishClick = () => {
    amplitudeService.logEvent('MADFISH_CLICK');
  };

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <Navigation className={styles.navigation} />
      <footer className={styles.footer}>
        <div className={styles.row}>
          <QPToken />
          <div className={cx(styles.mb0, styles.row)}>
            <SettingsButton />
            <div className={styles.ml24}>
              <ColorModeSwitcher id="mobile" />
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <NetworkSelect menuPlacement="top" className={styles.select} />
          <Button
            external
            href={QUIPUSWAP_OLD_VERSION_LINK}
            theme="secondary"
            className={styles.button}
            onClick={handleOldVersionClick}
          >
            {t('common|Old version')}
          </Button>
        </div>
        {IS_NETWORK_MAINNET && (
          <div className={styles.mb16}>
            <DonationButton />
          </div>
        )}
        <div className={styles.row}>
          <Button
            href="https://www.madfish.solutions/"
            external
            theme="clean"
            className={styles.madfish}
            onClick={handleMadfishClick}
          >
            <Madfish />
          </Button>

          <Socials />
        </div>
      </footer>
    </div>
  );
};
