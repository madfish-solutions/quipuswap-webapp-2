import { FC, useContext } from 'react';

import cx from 'classnames';
import { useLocation } from 'react-router-dom';

import { SLASH } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card } from '@shared/components';
import { getRouterParts } from '@shared/helpers';
import { useTranslation } from '@translation';

import styles from './create-new-position.module.scss';
import { LiquidityRoutes } from '../../../../liquidity-routes.enum';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const OpenNewPosition: FC = () => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { pathname } = useLocation();
  const sanitizedPathname = `/${getRouterParts(pathname).join(SLASH)}`;
  const url = `${sanitizedPathname}${LiquidityRoutes.create}`;

  return (
    <Card contentClassName={styles.content} className={cx(modeClass[colorThemeMode], styles.root)}>
      <p className={styles.text}>{t('liquidity|induceToOpenNewPosition')}</p>
      <Button className={styles.button} href={url}>
        {t('liquidity|createPosition')}
      </Button>
    </Card>
  );
};
