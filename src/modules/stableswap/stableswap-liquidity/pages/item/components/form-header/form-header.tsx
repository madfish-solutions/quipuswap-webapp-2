import { FC } from 'react';

import { AppRootRoutes } from '@app.router';
import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import { StableswapRoutes } from '../../../../../stableswap-routes.enum';
import styles from './form-header.module.scss';

export const FormHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Button
        href={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`}
        theme="quaternary"
        icon
        className={styles.arrowButton}
        data-test-id="backTTListButton"
      >
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('common|Back')}</span>
    </div>
  );
};
