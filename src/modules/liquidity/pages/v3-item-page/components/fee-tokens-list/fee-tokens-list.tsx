import { Table, TableProps } from '@shared/structures';

export const FeeTokensList = <T extends object>({
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
};
