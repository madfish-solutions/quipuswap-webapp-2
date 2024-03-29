import { useState, useEffect, useContext, FC, useRef } from 'react';

import cx from 'classnames';
import { useLocation } from 'react-router-dom';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { useAmplitudeService } from '@shared/hooks';
import { TempleIcon } from '@shared/svg/temple-icon';

import styles from './header.module.scss';
import { Menu } from './menu';
import { QPToken } from './qp-token';
import { MenuClosed, MenuOpened } from '../../svg';
import { Button } from '../button';
import { ColorModeSwitcher } from '../color-mode-switcher';
import { ConnectWalletButton } from '../connect-wallet-button';
import { LogoButton } from '../logo-button';
import { SettingsButton } from '../settings-button';

const TEMPLE_LINK = 'https://templewallet.com/mobile';
const TEMPLE_BANNER_CLICK = 'TEMPLE_BANNER_CLICK';

interface HeaderProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Header: FC<HeaderProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { log } = useAmplitudeService();

  const location = useLocation();
  const locationRef = useRef(location.pathname);

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  useEffect(() => {
    if (isMenuOpened) {
      document.querySelector('body')?.classList.add('ReactModal__Body--open');
    } else {
      document.querySelector('body')?.classList.remove('ReactModal__Body--open');
    }
  }, [isMenuOpened]);

  useEffect(() => {
    if (locationRef.current !== location.pathname) {
      locationRef.current = location.pathname;
      setIsMenuOpened(false);
    }
  }, [location.pathname]);

  const handleTempleBannerClick = () => {
    log(TEMPLE_BANNER_CLICK);
  };

  return (
    <div className={styles.wrapper}>
      <header className={cx(styles.root, modeClass[colorThemeMode], className)} data-test-id="header">
        <LogoButton href="/" />
        <ConnectWalletButton className={styles.connect} />

        <Button
          theme="quaternary"
          href={TEMPLE_LINK}
          external
          onClick={handleTempleBannerClick}
          className={styles.templeIcon}
        >
          <TempleIcon />
        </Button>
        <QPToken className={styles.qpToken} id="desktop" />
        <SettingsButton className={styles.settings} />
        <ColorModeSwitcher className={styles.coloModeSwitcher} />
        <Button
          theme="quaternary"
          className={styles.menuButton}
          onClick={() => setIsMenuOpened(!isMenuOpened)}
          data-test-id="menuButton"
        >
          {isMenuOpened ? <MenuOpened /> : <MenuClosed />}
        </Button>
      </header>
      <Menu className={cx(styles.menu, { [styles.active]: isMenuOpened })} />
    </div>
  );
};
