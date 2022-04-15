import { useState, useEffect, useContext, FC, useRef } from 'react';

import cx from 'classnames';
import { useLocation } from 'react-router-dom';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';

import { MenuClosed, MenuOpened } from '../../svg';
import { Button } from '../button';
import { ColorModeSwitcher } from '../color-mode-switcher';
import { ConnectWalletButton } from '../connect-wallet-button';
import { LogoButton } from '../logo-button';
import { SettingsButton } from '../settings-button';
import styles from './header.module.scss';
import { Menu } from './menu';

interface HeaderProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Header: FC<HeaderProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

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

  return (
    <div className={styles.wrapper} data-cy="header">
      <header className={cx(styles.root, modeClass[colorThemeMode], className)}>
        <LogoButton href="/" />
        <ConnectWalletButton className={styles.connect} />
        <SettingsButton className={styles.settings} />
        <ColorModeSwitcher className={styles.coloModeSwitcher} />
        <Button
          theme="quaternary"
          data-cy="hBurgerMenu"
          className={styles.menuButton}
          onClick={() => setIsMenuOpened(!isMenuOpened)}
        >
          {isMenuOpened ? <MenuOpened /> : <MenuClosed />}
        </Button>
      </header>
      <Menu className={cx(styles.menu, { [styles.active]: isMenuOpened })} />
    </div>
  );
};
