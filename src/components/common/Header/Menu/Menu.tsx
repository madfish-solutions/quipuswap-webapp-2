import React, { useContext } from 'react';

import { Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP_OLD_VERSION_LINK } from '@app.config';
import { NetworkSelect, ColorModeSwitcher } from '@components/ui/components';
import { Button } from '@components/ui/elements/button';

import { Navigation } from '../Navigation';
import { QPToken } from '../QPToken';
import { Socials } from '../Socials';
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
