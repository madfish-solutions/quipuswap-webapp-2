import { observer } from 'mobx-react-lite';

import { ListFilterBaseView, TokensFilter } from '@shared/components';

import { TokensCategoriesFilter } from '../tokens-categories-filter';
import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';

export const ListFilter = observer(() => {
  const params = useListFilterViewModel();

  return (
    <>
      <ListFilterBaseView
        sorterClassName={styles.sorterView}
        contentClassName={styles.filterCard}
        leftSide={<TokensFilter className={styles.leftSide} />}
        rightSide={<TokensCategoriesFilter className={styles.rightSide} />}
        {...params}
      />
    </>
  );
});
