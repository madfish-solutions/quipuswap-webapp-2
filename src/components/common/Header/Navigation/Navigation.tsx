import React, { FC, ReactNode, useContext, useMemo, useState } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import { isActivePath } from '@components/common/Header/Navigation/utils';
import { useNetwork } from '@utils/dapp';

import { makeNavigationData } from './content';
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
  const location = useLocation();
  const network = useNetwork();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isInnerMenuOpened, setIsInnerMenuOpened] = useState(false);

  const content = useMemo(() => {
    const result: ReactNode[] = [];
    const navigationData = makeNavigationData(network.id);
    navigationData.forEach(({ id, href, label, Icon, links, as }) => {
      if (href) {
        result.push(
          <Link key={id} to={href}>
            <a
              className={cx(
                s.link,
                {
                  [s.active]: isActivePath(location.pathname, href)
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
                <Link key={link.id} to={link.href ?? ''}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    className={cx(s.linkInner, modeClass[colorThemeMode])}
                    target="_blank"
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
  }, [network.id, colorThemeMode, iconId, isInnerMenuOpened, location.pathname]);

  return <nav className={cx(s.root, className)}>{content}</nav>;
};
