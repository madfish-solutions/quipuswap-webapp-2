import { FC, useContext } from 'react';

import cx from 'classnames';

import { QUIPUSWAP_OLD_VERSION_LINK } from '@config/config';
import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { useTranslation } from '@shared/hooks';

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

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <Navigation className={styles.navigation} />
      <footer className={styles.footer}>
        <div className={styles.row}>
          <QPToken />
          <div className={cx(styles.mb0, styles.row)}>
            <div className={styles.ml24}>
              <ColorModeSwitcher id="mobile" />
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <NetworkSelect menuPlacement="top" className={styles.select} />
          <Button external href={QUIPUSWAP_OLD_VERSION_LINK} theme="secondary" className={styles.button}>
            {t('common|Old version')}
          </Button>
        </div>
        <div className={styles.row}>
          <Button href="https://www.madfish.solutions/" external theme="clean" className={styles.madfish}>
            <Madfish />
          </Button>

          <Socials />
        </div>
      </footer>
    </div>
  );
};
