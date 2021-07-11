import React, {
  useContext, useEffect, useState,
} from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import Token from '@icons/Token.svg';
import { socialLinks } from '@content/socialLinks';
import { Socials } from '../Header/Menu/Socials';
import { Navigation } from './content';

import s from './Sidebar.module.sass';

type SidebarProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Sidebar: React.FC<SidebarProps> = ({
  className,
}) => {
  const router = useRouter();
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (Navigation && router) {
      setActive(Navigation.find((item) => router.pathname.includes(item.href))?.id ?? 0);
    }
  }, [router]);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.wallet}>
        <Button
          className={s.connect}
          href={QUIPUSWAP}
          external
        >
          {t('common:Connect wallet')}
        </Button>
        <Button
          className={s.connect}
          href={QUIPUSWAP}
        >
          {t('common:Mainnet')}
        </Button>
      </div>
      <div className={s.spacebetween}>
        <nav>
          <ul className={s.links}>
            {Navigation.map(({
              id, href, label, Icon,
            }) => (
              <li key={id}>
                <Button
                  theme="clean"
                  href={href}
                  className={cx(s.link, { [s.active]: id === active })}
                >
                  <Icon active={id === active} />
                  <span className={s.text}>{label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <div className={s.account}>
            <Token className={s.tokenIcon} />
            <span className={s.invoice}>$ 5.34</span>
          </div>
          <Socials className={s.socials} {...{ socialLinks }} />
        </div>
      </div>
    </div>
  );
};
