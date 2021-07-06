import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Container } from '@components/ui/Container';
import { Button } from '@components/ui/Button';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { socialLinks } from '@content/socialLinks';

import s from './Menu.module.sass';

type MenuProps = {
  content: {
    id: number
    href: string
    label: string
  }[]
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Menu: React.FC<MenuProps> = ({
  content,
  className,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <Container className={s.container}>
        <div className={s.content}>
          <Button
            className={s.button}
            href={QUIPUSWAP}
            external
          >
            {t('common:Launch App')}
          </Button>
          {content.map(({ id, href, label }) => (
            <Button
              key={id}
              theme="tertiary"
              href={href}
              external
              className={s.button}
            >
              {label}
            </Button>
          ))}
        </div>
        <footer className={s.footer}>
          <ColorModeSwitcher className={s.coloModeSwitcher} id="mobile" />
          <div className={s.socials}>
            {socialLinks.map(({
              id, href, label, Icon,
            }) => (
              <Button
                key={id}
                theme="quaternary"
                href={href}
                title={label}
                className={s.socialLink}
              >
                <Icon />
              </Button>
            ))}
          </div>
        </footer>
      </Container>
    </div>
  );
};
