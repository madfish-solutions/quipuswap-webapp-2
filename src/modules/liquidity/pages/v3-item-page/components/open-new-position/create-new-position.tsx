import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';

import { SLASH } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card } from '@shared/components';
import { getRouterParts } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useV3NewPosition } from '../../../../hooks';
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
  const { createNewV3Position } = useV3NewPosition();
  const sanitizedPathname = `/${getRouterParts(pathname).join(SLASH)}`;
  const url = `${sanitizedPathname}${LiquidityRoutes.create}`;

  // TODO remove this handler and use href={url} directly
  const createPositionHandler = () => {
    // eslint-disable-next-line no-console
    console.log('click - url', url);
    void createNewV3Position(new BigNumber('123'), new BigNumber('234'), new BigNumber('10'), new BigNumber('20'));
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
