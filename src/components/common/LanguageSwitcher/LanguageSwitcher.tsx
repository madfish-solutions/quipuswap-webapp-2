import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';
import { isTouchDevice } from '@utils/helpers';

import s from './LanguageSwitcher.module.sass';

type LanguageSwitcherProps = {
  direction?: keyof typeof directionClass
  buttonClassName?: string
  className?: string
};

const directionClass = {
  up: s.up,
  bottom: s.bottom,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  direction = 'up',
  buttonClassName,
  className,
}) => {
  const router = useRouter();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isLocalesOpened, setIsLocalesOpened] = useState(false);

  const { locale, locales } = router;

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={cx(
        s.root,
        modeClass[colorThemeMode],
        directionClass[direction],
        { [s.opened]: isLocalesOpened },
        className,
      )}
      onClick={() => isTouchDevice() && setIsLocalesOpened(!isLocalesOpened)}
      onMouseOver={() => !isTouchDevice() && setIsLocalesOpened(true)}
      onFocus={() => setIsLocalesOpened(true)}
      onMouseLeave={() => !isTouchDevice() && setIsLocalesOpened(false)}
      onBlur={() => setIsLocalesOpened(false)}
    >
      <button
        type="button"
        className={cx(s.button, buttonClassName)}
      >
        {locale}
      </button>
      <nav className={s.locales}>
        {locales?.map((loc) => (loc === locale
          ? (
            <span key={loc} className={cx(s.locale, s.active)}>
              {loc}
            </span>
          )
          : (
            <Link key={loc} href={`${router.asPath}`} locale={loc}>
              <a className={s.locale}>
                {loc}
              </a>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
};
