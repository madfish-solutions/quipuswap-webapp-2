import React, { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Container } from '@components/ui/Container';
import { Button } from '@components/ui/Button';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { Menu } from '@components/common/Header/Menu';
import { Logo } from '@components/svg/Logo';
import { MenuClosed } from '@components/svg/MenuClosed';
import { MenuOpened } from '@components/svg/MenuOpened';

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
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const content = useMemo(() => ([
    {
      id: 0,
      href: 'https://docs.quipuswap.com/',
      label: t('common:Docs'),
    },
    {
      id: 1,
      href: 'https://story.madfish.solutions/',
      label: t('common:Blog'),
    },
  ]), [t]);

  return (
    <div className={s.wrapper}>
      <header className={cx(s.root, modeClass[colorThemeMode], className)}>
        <Container className={s.container}>
          <Link href="/">
            <a className={s.logo}>
              <Logo className={s.logoIcon} />
              QuipuSwap
            </a>
          </Link>
          <div className={s.content}>
            <ul className={s.links}>
              {content.map(({ id, href, label }) => (
                <li key={id}>
                  <Button
                    theme="clean"
                    href={href}
                    external
                    className={s.link}
                  >
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              className={s.buttonLaunch}
              href={QUIPUSWAP}
              external
            >
              {t('common:Launch App')}
            </Button>
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
        content={content}
      />
    </div>
  );
};
