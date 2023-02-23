import { observer } from 'mobx-react-lite';

import { ListFilterBaseView, SorterPositionEnum, TokensFilter } from '@shared/components';

import { PoolTypeFilter } from '../pool-type-filter';
import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';

export const ListFilter = observer(() => {
  const params = useListFilterViewModel();

  return (
    <>
      <ListFilterBaseView
        sorterClassName={styles.sorterView}
        sorterPosition={SorterPositionEnum.LEFT}
        contentClassName={styles.filterCard}
        leftSide={
          <div className={styles.leftSide}>
            <TokensFilter />
          </div>
        }
        rightSide={<PoolTypeFilter className={styles.rightSide} />}
        {...params}
      />
    </>
  );
});
