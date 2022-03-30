import { useState, useEffect, useContext, FC } from 'react';

import { LogoButton, ColorModes, MenuClosed, MenuOpened, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Button } from '../button';
import { ColorModeSwitcher } from '../color-mode-switcher';
import { ConnectWalletButton } from '../connect-button';
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

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  useEffect(() => {
    if (isMenuOpened) {
      document.querySelector('body')?.classList.add('ReactModal__Body--open');
    } else {
      document.querySelector('body')?.classList.remove('ReactModal__Body--open');
    }
  }, [isMenuOpened]);

  return (
    <div className={styles.wrapper}>
      <header className={cx(styles.root, modeClass[colorThemeMode], className)}>
        <LogoButton href="/" />
        <ConnectWalletButton className={styles.connect} />
        <ColorModeSwitcher className={styles.coloModeSwitcher} />
        <Button theme="quaternary" className={styles.menuButton} onClick={() => setIsMenuOpened(!isMenuOpened)}>
          {isMenuOpened ? <MenuOpened /> : <MenuClosed />}
        </Button>
      </header>
      <Menu className={cx(styles.menu, { [styles.active]: isMenuOpened })} />
    </div>
  );
};
