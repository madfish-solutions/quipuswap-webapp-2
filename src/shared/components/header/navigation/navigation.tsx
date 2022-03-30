import { FC, ReactNode, useContext, useMemo, useState } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import { navigationData } from './content';
import styles from './navigation.module.scss';
import { isActivePath } from './utils';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface NavigationProps {
  iconId?: string;
  className?: string;
}

export const Navigation: FC<NavigationProps> = ({ iconId, className }) => {
  const router = useLocation();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isInnerMenuOpened, setIsInnerMenuOpened] = useState(false);

  const content = useMemo(() => {
    const result: ReactNode[] = [];
    navigationData.forEach(({ id, href, label, Icon, links, as, matchHrefs = [href] }) => {
      if (href) {
        result.push(
          <Link key={id} to={href}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              className={cx(
                styles.link,
                {
                  [styles.active]: matchHrefs.some(matchHref => isActivePath(router.pathname, matchHref!))
                },
                modeClass[colorThemeMode]
              )}
            >
              {Icon && <Icon className={styles.icon} id={iconId} />}
              {label}
            </a>
          </Link>
        );
      }
      if (links) {
        result.push(
          <div key="navigationWrapper" className={cx(styles.linksWrapper, { [styles.menuOpened]: isInnerMenuOpened })}>
            <button
              type="button"
              className={cx(styles.link, styles.linkToggle, modeClass[colorThemeMode])}
              onClick={() => setIsInnerMenuOpened(!isInnerMenuOpened)}
            >
              {Icon && <Icon className={styles.icon} id={iconId} />}
              {label}
            </button>
            <span className={styles.linksInner}>
              {links.map(link => (
                <Link key={link.id} to={link.href ?? ''}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    className={cx(styles.linkInner, modeClass[colorThemeMode])}
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

  return <nav className={cx(styles.root, className)}>{content}</nav>;
};
