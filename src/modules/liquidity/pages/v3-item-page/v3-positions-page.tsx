import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { FarmingListSkeleton } from '@modules/farming/pages/list/components';
import { Iterator, ListItemCard, ListStats, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { EmptyPositionsList, OpenNewPosition, PageTitleContainer, PositionsFeesList } from './components';
import { useV3PositionsViewModel } from './use-v3-positions.vm';
import styles from './v3-positions-page.module.scss';

export const V3PositionsPage: FC = observer(() => {
  const { isLoading, positions, stats } = useV3PositionsViewModel();
  const { t } = useTranslation();

  return (
    <>
      <TestnetAlert />
      <PageTitleContainer dataTestId="v3LiqPositions" titleText={t('liquidity|positions')} />
      <ListStats stats={stats} slidesToShow={3} />
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton className={styles.mb48} />}>
        <PositionsFeesList />
      </StateWrapper>
      <OpenNewPosition />
      <StateWrapper isLoading={isLoading} loaderFallback={<FarmingListSkeleton />}>
        <Iterator
          data={positions}
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
