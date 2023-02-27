import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { AppRootRoutes } from '@app.router';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs } from '@modules/stableswap/types';
import { Button, Card, PageTitle, TestnetAlert } from '@shared/components';
import { ArrowDown } from '@shared/svg';

import { LiquidityRoutes } from '../../liquidity-routes.enum';
import { CreatePoolOption } from './components';
import styles from './create-pool.module.scss';
import { useCreatePoolViewModel } from './use-create-pool.vm';

export const CreatePoolPage: FC = observer(() => {
  const {
    cardContentClassName,
    translations,
    createHighEfficiencyPoolIcon,
    createNewStablePoolIcon,
    createRegularPoolIcon,
    createStablePoolIcon,
    shouldShowNewStableswapPoolOption
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
        <CreatePoolOption
          imageAlt="Create high efficiency pool icon"
          imageUrl={createHighEfficiencyPoolIcon}
          name={highEfficiencyPool}
          href={`${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${LiquidityRoutes.create}`}
        />
        <CreatePoolOption
          imageAlt="Create regular pool icon"
          imageUrl={createRegularPoolIcon}
          name={regularPool}
          href={`${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}${LiquidityRoutes.create}`}
        />
        <CreatePoolOption
          imageAlt="Create stable pool icon"
          imageUrl={createStablePoolIcon}
          name={stablePool}
          href={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.create}?version=1`}
        />
        {shouldShowNewStableswapPoolOption && (
          <CreatePoolOption
            imageAlt="Create new stable pool icon"
            imageUrl={createNewStablePoolIcon}
            name={stablePool}
            href={`${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.create}`}
          />
        )}
      </Card>
    </>
  );
});
