import { observer } from 'mobx-react-lite';

import { ListFilterBaseView, TokensFilter } from '@shared/components';

import { PoolTypeFilter } from '../pool-type-filter';
import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';

export const ListFilter = observer(() => {
  const params = useListFilterViewModel();

  return (
    <>
      <ListFilterBaseView
        sorterClassName={styles.sorterView}
        contentClassName={styles.filterCard}
        leftSide={
          <div className={styles.leftSide}>
            <TokensFilter />
          </div>
        }
        rightSide={
          <div className={styles.rightSide}>
            <PoolTypeFilter />
          </div>
        }
        {...params}
      />
    </>
  );
});
