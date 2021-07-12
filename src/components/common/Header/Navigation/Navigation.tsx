import React, { useContext } from 'react';
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

  return (
    <nav className={cx(s.root, className)}>
      {
        NavigationData.map(({
          id,
          href,
          external,
          label,
          Icon,
        }) => (!external ? (
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
          </Link>
        ) : (
          <Link
            key={id}
            href={href}
          >
            <a
              className={cx(
                s.link,
                modeClass[colorThemeMode],
              )}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon className={s.icon} />
              {label}
            </a>
          </Link>
        )))
      }
    </nav>
  );
};
