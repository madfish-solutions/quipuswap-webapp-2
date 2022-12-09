import { FC, useContext } from 'react';

import cx from 'classnames';
import { useLocation } from 'react-router-dom';

import { SLASH } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card } from '@shared/components';
import { getRouterParts } from '@shared/helpers';
import { useTranslation } from '@translation';

import { LiquidityRoutes } from '../../../../liquidity-routes.enum';
import styles from './create-new-position.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const OpenNewPosition: FC = () => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { pathname } = useLocation();
  const sanitizedPathname = `/${getRouterParts(pathname).join(SLASH)}`;

  return (
    <Card contentClassName={styles.content} className={cx(modeClass[colorThemeMode], styles.root)}>
      <p className={styles.text}>{t('liquidity|induceToOpenNewPosition')}</p>
      <Button className={styles.button} href={`${sanitizedPathname}${LiquidityRoutes.create}`}>
        {t('liquidity|createPosition')}
      </Button>
    </Card>
  );
};
