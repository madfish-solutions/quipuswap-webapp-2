import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { Trans } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Container } from '@components/ui/Container';
import { Button } from '@components/ui/Button';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { Menu } from '@components/common/Header/Menu';
import { Logo } from '@components/svg/Logo';
import { MenuClosed } from '@components/svg/MenuClosed';
import { MenuOpened } from '@components/svg/MenuOpened';
import { QUIPUSWAP } from '@utils/defaults';
import { Navigation } from '../Sidebar/content';

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

  return (
    <div className={s.wrapper}>
      <header className={cx(s.root, modeClass[colorThemeMode], className)}>
        <Container className={s.container}>
          <div className={s.leftpart}>
            <Link href="/">
              <a className={s.logo}>
                <Logo className={s.logoIcon} />
                <span className={s.logoText}>QuipuSwap</span>
              </a>
            </Link>
            <Button
              className={s.connect}
              href={QUIPUSWAP}
              external
            >
              <Trans ns="common">Connect wallet</Trans>
            </Button>
          </div>
          <div className={s.content}>
            <LanguageSwitcher
              direction="bottom"
              className={s.languageSwitcher}
              buttonClassName={s.languageSwitcherButton}
            />
            <ColorModeSwitcher className={s.coloModeSwitcher} />
            <Button
              theme="quaternary"
              className={s.menuButton}
              onClick={() => setIsMenuOpened(!isMenuOpened)}
            >
              {isMenuOpened ? <MenuOpened /> : <MenuClosed />}
            </Button>
          </div>
        </Container>
      </header>
      <Menu
        className={cx(s.menu, { [s.active]: isMenuOpened })}
        content={Navigation}
      />
    </div>
  );
};
