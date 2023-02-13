import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { AppRootRoutes } from '@app.router';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs } from '@modules/stableswap/types';
import { Button, Card, PageTitle, TestnetAlert } from '@shared/components';
import { ArrowDown } from '@shared/svg';

import { LiquidityRoutes } from '../../liquidity-routes.enum';
import styles from './create-pool.module.scss';
import { useCreatePoolViewModel } from './use-create-pool.vm';

export const CreatePoolPage: FC = observer(() => {
  const {
    cardContentClassName,
    translations,
    createHighEfficiencyPoolIcon,
    createRegularPoolIcon,
    createStablePoolIcon
  } = useCreatePoolViewModel();

  const { createPool, highEfficiencyPool, stablePool, regularPool, back } = translations;

  return (
    <>
      <TestnetAlert />

      <PageTitle>{createPool}</PageTitle>

      <Card
        contentClassName={cardContentClassName}
        header={{
          content: (
            <div className={styles.headerContent}>
              <Button
                href={AppRootRoutes.Liquidity}
                theme="quaternary"
                icon={<ArrowDown className={styles.backArrow} />}
                className={styles.arrowButton}
                data-test-id="backNewLiquidityButton"
              />
              <span>{back}</span>
            </div>
          )
        }}
      >
        <div className={styles.poolWrapper}>
          <img className={styles.img} src={createHighEfficiencyPoolIcon} alt="Create high efficiency pool icon" />
          <h2 className={styles.subtitle}>{highEfficiencyPool}</h2>
          <Button
            className={styles.button}
            href={`${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${LiquidityRoutes.create}`}
          >
            {createPool}
          </Button>
        </div>
        <div className={styles.poolWrapper}>
          <img className={styles.img} src={createRegularPoolIcon} alt="Create regular pool icon" />
          <h2 className={styles.subtitle}>{regularPool}</h2>
          <Button
            className={styles.button}
            href={`${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}${LiquidityRoutes.create}`}
          >
            {createPool}
          </Button>
        </div>
        <div className={styles.poolWrapper}>
          <img className={styles.img} src={createStablePoolIcon} alt="Create stable pool icon" />
          <h2 className={styles.subtitle}>{stablePool}</h2>
          <Button
            className={styles.button}
            href={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.create}`}
          >
            {createPool}
          </Button>
        </div>
      </Card>
    </>
  );
});
