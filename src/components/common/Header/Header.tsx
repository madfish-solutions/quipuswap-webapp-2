import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  LogoButton,
  ColorModes,
  MenuClosed,
  MenuOpened,
  LanguageSwitcher,
  ColorThemeContext,
  ColorModeSwitcher,
  ConnectWalletButton,
} from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Menu } from '@components/common/Header/Menu';

import s from './Header.module.sass';

type HeaderProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Header: React.FC<HeaderProps> = ({
  className,
}) => {
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
    <div className={s.wrapper}>
      <header className={cx(s.root, modeClass[colorThemeMode], className)}>
        <LogoButton />
        <ConnectWalletButton className={s.connect} />
        <LanguageSwitcher
          direction="bottom"
          className={s.languageSwitcher}
        />
        <ColorModeSwitcher className={s.coloModeSwitcher} />
        <Button
          theme="quaternary"
          className={s.menuButton}
          onClick={() => setIsMenuOpened(!isMenuOpened)}
        >
          {isMenuOpened ? <MenuOpened /> : <MenuClosed />}
        </Button>
      </header>
      <Menu
        className={cx(s.menu, { [s.active]: isMenuOpened })}
      />
    </div>
  );
};
