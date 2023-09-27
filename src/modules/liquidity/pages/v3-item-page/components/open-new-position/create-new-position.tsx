import { FC, useContext } from 'react';

import cx from 'classnames';
import { useLocation, useParams } from 'react-router-dom';

import { IS_NETWORK_MAINNET } from '@config/config';
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

  const params = useParams();

  const is83 = params?.id === '83' && IS_NETWORK_MAINNET;

  return (
    <Card
      style={{
        minHeight: is83 ? '88px' : 'auto'
      }}
      contentClassName={styles.content}
      className={cx(modeClass[colorThemeMode], styles.root)}
    >
      {is83 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minHeight: '88px',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'rgba(255, 255, 0, 0.8)',
            paddingLeft: 8
          }}
        >
          <p>The deposits to the pool are paused.</p>
        </div>
      ) : (
        <>
          <p className={styles.text}>{t('liquidity|induceToOpenNewPosition')}</p>
          <Button disabled className={styles.button} href={url}>
            {t('liquidity|createPosition')}
          </Button>
        </>
      )}
    </Card>
  );
};
