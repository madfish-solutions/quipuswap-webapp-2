import React, { useContext } from 'react';

import { Button, Madfish, ColorModes, LanguageSwitcher, ColorModeSwitcher, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { appi18n } from '@app.i18n';
import { NetworkSelect } from '@components/common/NetworkSelect';

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
  const { t } = appi18n;
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <Navigation className={s.navigation} />
      <footer className={s.footer}>
        <div className={s.row}>
          <QPToken />
          <div className={cx(s.mb0, s.row)}>
            <LanguageSwitcher direction="up" />
            <div className={s.ml24}>
              <ColorModeSwitcher id="mobile" />
            </div>
          </div>
        </div>
        <div className={s.row}>
          <NetworkSelect menuPlacement="top" className={s.select} />
          <Button external href="https://quipuswap.com/" theme="secondary" className={s.button}>
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
