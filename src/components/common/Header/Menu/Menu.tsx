import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Button, ColorModeSwitcher } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';
import { NetworkSelect } from '@components/common/NetworkSelect';
import { Madfish } from '@components/svg/Madfish';

import { Navigation } from '../Navigation';
import { Socials } from '../Socials';
import { QPToken } from '../QPToken';
import s from './Menu.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type MenuProps = {
  className?: string
};

export const Menu: React.FC<MenuProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common']);
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
          <Button
            href="https://www.madfish.solutions/"
            external
            theme="clean"
            className={s.madfish}
          >
            <Madfish />
          </Button>

          <Socials />
        </div>
      </footer>
    </div>
  );
};
