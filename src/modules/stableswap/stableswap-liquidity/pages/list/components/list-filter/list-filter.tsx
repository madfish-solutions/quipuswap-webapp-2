import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterView } from '@shared/components/list-filter-view';

import { useListFilterViewModel } from './list-filter.vm';

export const ListFilter: FC = observer(() => {
  const {
    search,
    tokenIdValue,
    onSearchChange,
    onTokenIdChange,
    handleIncrement,
    handleDecrement,
    translation,
    switcherData
  } = useListFilterViewModel();

  return (
    <ListFilterView
      search={search}
      tokenIdValue={tokenIdValue}
      onSearchChange={onSearchChange}
      onTokenIdChange={onTokenIdChange}
      handleIncrement={handleIncrement}
      handleDecrement={handleDecrement}
      translation={translation}
      switcherData={switcherData}
    />
  );
});
