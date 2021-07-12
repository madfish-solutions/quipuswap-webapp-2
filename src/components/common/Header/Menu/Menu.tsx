import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { socialLinks } from '@content/socialLinks';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';
import { Navigation } from '@components/common/Sidebar/content';
import { Socials } from './Socials';
import { NavLink } from '../NavLink';

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
  const router = useRouter();
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (Navigation && router) {
      setActive(Navigation.find((item) => router.pathname.includes(item.href))?.id ?? 0);
    }
  }, [router]);
  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.container}>
        <div className={s.content}>
          {content.map(({
            id, href, label, Icon,
          }) => (
            <NavLink
              key={href}
              className={s.navlink}
              active={id === active}
              {...{ href }}
              {...{ label }}
              {...{ Icon }}
            />
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
      </div>
    </div>
  );
};
