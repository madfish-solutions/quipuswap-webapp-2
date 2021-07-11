import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Container } from '@components/ui/Container';
import { Button } from '@components/ui/Button';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { socialLinks } from '@content/socialLinks';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';
import { Socials } from './Socials';

import s from './Menu.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type MenuProps = {
  content: {
    id: number
    href: string
    external?: boolean
    label: React.ReactNode
    Icon: React.FC
  }[]
  className?: string
};

export const Menu: React.FC<MenuProps> = ({
  content,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <Container className={s.container}>
        <div className={s.content}>
          {content.map(({ id, href, label }) => (
            <Button
              key={id}
              theme="tertiary"
              href={href}
              external
              className={s.button}
            >
              {label}
            </Button>
          ))}
        </div>
        <footer className={s.footer}>
          <ColorModeSwitcher className={s.coloModeSwitcher} id="mobile" />
          <Socials className={s.socials} {...{ socialLinks }} />
          <LanguageSwitcher
            direction="up"
            className={s.languageSwitcher}
            buttonClassName={s.languageSwitcherButton}
          />
        </footer>
      </Container>
    </div>
  );
};
