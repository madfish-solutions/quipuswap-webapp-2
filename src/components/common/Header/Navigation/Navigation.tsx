import React, { FC, ReactNode, useContext, useMemo, useState } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { isActivePath } from '@components/common/Header/Navigation/utils';

import { navigationData } from './content';
import s from './Navigation.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface NavigationProps {
  iconId?: string;
  className?: string;
}

export const Navigation: FC<NavigationProps> = ({ iconId, className }) => {
  const router = useRouter();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isInnerMenuOpened, setIsInnerMenuOpened] = useState(false);

  const content = useMemo(() => {
    const result: ReactNode[] = [];
    navigationData.forEach(({ id, href, label, Icon, links, as }) => {
      if (href) {
        result.push(
          <Link key={id} href={href} as={as}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              className={cx(
                s.link,
                {
                  [s.active]: isActivePath(router.pathname, href)
                },
                modeClass[colorThemeMode]
              )}
            >
              {Icon && <Icon className={s.icon} id={iconId} />}
              {label}
            </a>
          </Link>
        );
      }
      if (links) {
        result.push(
          <div key="navigationWrapper" className={cx(s.linksWrapper, { [s.menuOpened]: isInnerMenuOpened })}>
            <button
              type="button"
              className={cx(s.link, s.linkToggle, modeClass[colorThemeMode])}
              onClick={() => setIsInnerMenuOpened(!isInnerMenuOpened)}
            >
              {Icon && <Icon className={s.icon} id={iconId} />}
              {label}
            </button>
            <span className={s.linksInner}>
              {links.map(link => (
                <Link key={link.id} href={link.href ?? ''}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    className={cx(s.linkInner, modeClass[colorThemeMode])}
                    target={link.target}
                    rel="noreferrer noopener"
                    onFocus={() => setIsInnerMenuOpened(true)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </span>
          </div>
        );
      }
    });

    return result;
  }, [colorThemeMode, iconId, isInnerMenuOpened, router.pathname]);

  return <nav className={cx(s.root, className)}>{content}</nav>;
};
