import { FC, ReactNode, useContext, useMemo, useState } from 'react';

import cx from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import { NAVIGATION_DATA } from './content';
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
    NAVIGATION_DATA.forEach(({ id, to, label, Icon, status, links }) => {
      if (to) {
        result.push(
          <Link
            key={id}
            to={to}
            className={cx(
              styles.link,
              {
                [styles.active]: isActivePath(router.pathname, to)
              },
              modeClass[colorThemeMode]
            )}
          >
            {Icon && <Icon className={styles.icon} id={iconId} />}
            {label}
            {status}
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
              {links.map(link => {
                if (link.target === '_blank') {
                  return (
                    <a
                      href={link.to}
                      className={cx(styles.linkInner, modeClass[colorThemeMode])}
                      target={link.target}
                      rel="noreferrer noopener"
                      onFocus={() => setIsInnerMenuOpened(true)}
                    >
                      {link.label}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={link.id}
                      to={link.to ?? ''}
                      className={cx(styles.linkInner, modeClass[colorThemeMode])}
                      target={link.target}
                      rel="noreferrer noopener"
                      onFocus={() => setIsInnerMenuOpened(true)}
                    >
                      {link.label}
                    </Link>
                  );
                }
              })}
            </span>
          </div>
        );
      }
    });

    return result;
  }, [colorThemeMode, iconId, isInnerMenuOpened, router.pathname]);

  return <nav className={cx(styles.root, className)}>{content}</nav>;
};
