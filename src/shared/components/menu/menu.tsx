import React, { useContext } from 'react';

import { Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { IS_NETWORK_MAINNET, QUIPUSWAP_OLD_VERSION_LINK } from '@config';
import { DonationButton } from '@shared/components/donation-button';
import { ColorModeSwitcher } from '@shared/components/color-mode-switcher';
import { NetworkSelect } from '@shared/components/network-select';
import { Button } from '@shared/components/button';

import { Navigation } from '@shared/components/navigation';
import { QPToken } from '@shared/components/QPToken';
import { Socials } from '@shared/components/socials';
import s from './Menu.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface MenuProps {
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <Navigation className={s.navigation} />
      <footer className={s.footer}>
        <div className={s.row}>
          <QPToken />
          <div className={cx(s.mb0, s.row)}>
            <div className={s.ml24}>
              <ColorModeSwitcher id="mobile" />
            </div>
          </div>
        </div>
        <div className={s.row}>
          <NetworkSelect menuPlacement="top" className={s.select} />
          <Button external href={QUIPUSWAP_OLD_VERSION_LINK} theme="secondary" className={s.button}>
            {t('common|Old version')}
          </Button>
        </div>
        {IS_NETWORK_MAINNET && (
          <div className={s.row}>
            <DonationButton />
          </div>
        )}
        <div className={s.row}>
          <Button href="https://www.madfish.solutions/" external theme="clean" className={s.madfish}>
            <Madfish />
          </Button>

          <Socials />
        </div>
      </footer>
    </div>
  );
};
