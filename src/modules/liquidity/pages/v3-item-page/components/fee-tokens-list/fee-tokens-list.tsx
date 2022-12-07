import { observer } from 'mobx-react-lite';

import { Table, TableProps } from '@shared/structures';

export const FeeTokensList = observer(
  <T extends object>({
    data,
    columns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomCellProps
  }: TableProps<T>) => {
    return (
      <Table
        getCustomTableProps={getCustomTableProps}
        getCustomHeaderProps={getCustomHeaderProps}
        getCustomCellProps={getCustomCellProps}
        data={data}
        columns={columns}
      />
    );
  }
);
