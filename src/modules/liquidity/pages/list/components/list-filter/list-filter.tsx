import { observer } from 'mobx-react-lite';

import { ListFilterBaseView, TokensFilter } from '@shared/components';

import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';
import { PoolTypeFilter } from '../pool-type-filter';

export const ListFilter = observer(() => {
  const params = useListFilterViewModel();

  return (
    <>
      <ListFilterBaseView
        sorterClassName={styles.sorterView}
        contentClassName={styles.filterCard}
        leftSide={<TokensFilter className={styles.leftSide} />}
        rightSide={<PoolTypeFilter className={styles.rightSide} />}
        {...params}
      />
    </>
  );
});
