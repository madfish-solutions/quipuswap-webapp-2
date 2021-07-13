import React, { ReactNode, useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { NavigationData } from './content';
import s from './Navigation.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type NavigationProps = {
  iconId?: string
  className?: string
};

export const Navigation: React.FC<NavigationProps> = ({
  iconId,
  className,
}) => {
  const router = useRouter();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isInnerMenuOpened, setIsInnerMenuOpened] = useState(false);

  const content: ReactNode[] = [];
  NavigationData.forEach(({
    id, href, label, Icon, links,
  }) => {
    if (href) {
      content.push(
        <Link
          key={id}
          href={href}
        >
          <a
            className={cx(
              s.link,
              {
                [s.active]: router.pathname === '/'
                  ? href === '/'
                  : href !== '/' && router.pathname.includes(href),
              },
              modeClass[colorThemeMode],
            )}
          >
            <Icon className={s.icon} id={iconId} />
            {label}
          </a>
        </Link>,
      );
    }
    if (links) {
      content.push(
        <div
          className={cx(s.linksWrapper, { [s.menuOpened]: isInnerMenuOpened })}
        >
          <button
            type="button"
            className={cx(s.link, s.linkToggle, modeClass[colorThemeMode])}
            onClick={() => setIsInnerMenuOpened(!isInnerMenuOpened)}
            onFocus={() => setIsInnerMenuOpened(true)}
          >
            <Icon className={s.icon} id={iconId} />
            {label}
          </button>
          <span className={s.linksInner}>
            {links.map((el) => (
              <Link
                key={el.id}
                href={el.href}
              >
                <a
                  className={cx(
                    s.linkInner,
                    modeClass[colorThemeMode],
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {el.label}
                </a>
              </Link>
            ))}
          </span>
        </div>,
      );
    }
  });

  return (
    <nav className={cx(s.root, className)}>
      {content}
    </nav>
  );
};
