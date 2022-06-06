import { FC, MouseEvent, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import cx from 'classnames';
import { useLocation } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import { isExist } from '../../../helpers';
import { amplitudeService } from '../../../services';
import { Undefined } from '../../../types';
import { ButtonOrLink } from './components';
import { isShow, NAVIGATION_DATA } from './content';
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
  const [isInnerMenuOpened, setIsInnerMenuOpened] = useState<Record<string, boolean>>({ '1': false });

  const handleMenuClick = (url: string) => {
    amplitudeService.logEvent('MAIN_MENU_CLICK', { url });
  };

  const handleToggleMenu = useCallback(
    (event: Undefined<MouseEvent<HTMLAnchorElement>>, id: string, value?: boolean) => {
      event?.preventDefault();
      setIsInnerMenuOpened({
        ...isInnerMenuOpened,
        [id]: isExist(value) ? value : !isInnerMenuOpened[id]
      });
    },
    [isInnerMenuOpened]
  );

  const content = useMemo(() => {
    const result: ReactNode[] = [];
    NAVIGATION_DATA.filter(isShow).forEach(link => {
      if (link.to) {
        result.push(
          <ButtonOrLink
            key={link.id}
            link={link}
            className={cx(
              styles.link,
              {
                [styles.active]: isActivePath(router.pathname, link.to)
              },
              modeClass[colorThemeMode]
            )}
            icon={link.Icon ? <link.Icon className={styles.icon} id={iconId} /> : null}
            onFocus={() => handleToggleMenu(undefined, link.id, false)}
            onClick={() => handleMenuClick(link.to ?? '')}
            data-test-id={`navigationButton-${link.id}`}
          />
        );
      }
      if (link.links) {
        result.push(
          <div className={cx(styles.linksWrapper, { [styles.menuOpened]: isInnerMenuOpened[link.id] })} key={link.id}>
            <ButtonOrLink
              key={link.id}
              link={link}
              className={cx(styles.link, styles.linkToggle, modeClass[colorThemeMode])}
              onClick={event => handleToggleMenu(event, link.id)}
              data-test-id={`secondaryNavigationButton-${link.id}`}
            />
            <span className={styles.linksInner}>
              {link.links.filter(isShow).map(subLink => (
                <ButtonOrLink
                  key={subLink.id}
                  link={subLink}
                  className={cx(styles.linkInner, modeClass[colorThemeMode])}
                  onFocus={() => handleToggleMenu(undefined, link.id, true)}
                  onClick={() => handleMenuClick(subLink.to ?? '')}
                  data-test-id={`secondaryNavigationButton-${subLink.id}`}
                />
              ))}
            </span>
          </div>
        );
      }
    });

    return result;
  }, [colorThemeMode, handleToggleMenu, iconId, isInnerMenuOpened, router.pathname]);

  return <nav className={cx(styles.root, className)}>{content}</nav>;
};
