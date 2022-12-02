import { observer } from 'mobx-react-lite';

import { Table } from '@shared/structures';

import { useFeeTokensListViewModel } from './fee-tokens-list.vm';

export const FeeTokensList = observer(() => {
  const { rows, columns, getCustomTableProps, getCustomHeaderProps, getCustomCellProps } = useFeeTokensListViewModel();

  return (
    <Table
      getCustomTableProps={getCustomTableProps}
      getCustomHeaderProps={getCustomHeaderProps}
      getCustomCellProps={getCustomCellProps}
      data={rows}
      columns={columns}
    />
  );
});
