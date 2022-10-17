import { observer } from 'mobx-react-lite';

import { ListFilterBaseView } from '@shared/components';
import styles from '@shared/components/list-filter-base-view/list-filter-base-view.module.scss';

import { TokensCategoriesFilter } from '../tokens-categories-filter';
import { useListFilterViewModel } from './list-filter.vm';

export const ListFilter = observer(() => {
  const params = useListFilterViewModel();

  return (
    <ListFilterBaseView
      leftSide={<div className={styles.searchInput}>Filters by tokens</div>}
      rightSide={<TokensCategoriesFilter />}
      {...params}
    />
  );
});
