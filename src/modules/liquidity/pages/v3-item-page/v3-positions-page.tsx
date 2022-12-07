import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, Skeleton, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import {
  EmptyPositionsList,
  LiquidityV3PoolStats,
  OpenNewPosition,
  PageTitleContainer,
  PositionsFeesList
} from './components';
import { useV3PositionsViewModel } from './use-v3-positions.vm';
import styles from './v3-positions-page.module.scss';

export const V3PositionsPage: FC = observer(() => {
  const { isLoading, positionsViewModel } = useV3PositionsViewModel();
  const { t } = useTranslation();

  return (
    <>
      <TestnetAlert />
      <PageTitleContainer dataTestId="v3LiqPositions" titleText={t('liquidity|Liquidity')} />
      <LiquidityV3PoolStats />
      <StateWrapper
        isLoading={isLoading}
        loaderFallback={<Skeleton className={cx(styles.positionFeesSkeleton, styles.mb48)} />}
      >
        <PositionsFeesList />
      </StateWrapper>
      <OpenNewPosition />
      <StateWrapper isLoading={isLoading} loaderFallback={<Skeleton className={styles.listSkeleton} />}>
        <Iterator
          data={positionsViewModel}
          render={ListItemCard}
          fallback={<EmptyPositionsList />}
          isGrouped
          wrapperClassName={styles.list}
          DTI="v3PositionsList"
        />
      </StateWrapper>
    </>
  );
});
