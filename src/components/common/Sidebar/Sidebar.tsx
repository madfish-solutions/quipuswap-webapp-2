import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import Token from '@icons/Token.svg';

import { Navigation } from '../Header/Navigation';
import { Socials } from '../Header/Socials';
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
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.wallet}>
        <Button
          className={s.button}
          href={QUIPUSWAP}
          external
        >
          {t('common:Connect wallet')}
        </Button>
        <Button
          className={s.button}
          href={QUIPUSWAP}
        >
          {t('common:Mainnet')}
        </Button>
      </div>
      <Navigation className={s.navigation} iconId="desktop" />
      <footer className={s.footer}>
        <div className={s.token}>
          <Token className={s.tokenIcon} />
          <span className={s.price}>$ 5.34</span>
        </div>
        <Socials className={s.socials} />
      </footer>
    </div>
  );
};
