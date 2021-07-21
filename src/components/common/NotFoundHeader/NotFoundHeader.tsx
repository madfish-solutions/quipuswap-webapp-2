import React, { useContext, useEffect, useState } from 'react';
// import Link from 'next/link';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';
import { Menu } from '@components/common/Header/Menu';
import { LaunchAppButton } from '@components/common/LaunchAppButton';
import { LogoButton } from '@components/common/LogoButton';
import { MenuClosed } from '@components/svg/MenuClosed';
import { MenuOpened } from '@components/svg/MenuOpened';

import s from './NotFoundHeader.module.sass';

type NotFoundHeaderProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const NotFoundHeader: React.FC<NotFoundHeaderProps> = ({
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
        <LaunchAppButton className={s.connect} />
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
