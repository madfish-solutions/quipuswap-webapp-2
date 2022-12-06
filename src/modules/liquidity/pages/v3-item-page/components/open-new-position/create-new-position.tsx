import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card } from '@shared/components';
import { useTranslation } from '@translation';

import { useV3NewPool } from '../../../../hooks';
import { LiquidityRoutes } from '../../../../liquidity-routes.enum';
import styles from './create-new-position.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const OpenNewPosition: FC = observer(() => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { pathname } = useLocation();
  const { createNewV3Pool } = useV3NewPool();

  // TODO:  href={`${pathname}${LiquidityRoutes.create}`}
  const createPositionHandler = () => {
    // eslint-disable-next-line no-console
    console.log('click', `${pathname}${LiquidityRoutes.create}`);
    void createNewV3Pool();
  };

  return (
    <Card contentClassName={styles.content} className={cx(modeClass[colorThemeMode], styles.root)}>
      <p className={styles.text}>{t('liquidity|induceToOpenNewPosition')}</p>
      <Button className={styles.button} onClick={createPositionHandler}>
        {t('liquidity|createPosition')}
      </Button>
    </Card>
  );
});
