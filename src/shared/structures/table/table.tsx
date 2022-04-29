import {
  CellPropGetter,
  Column,
  HeaderGroupPropGetter,
  HeaderPropGetter,
  RowPropGetter,
  TableBodyPropGetter,
  TablePropGetter,
  useTable
} from 'react-table';

interface TableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  getCustomTableProps?: TablePropGetter<T>;
  getCustomHeaderGroupProps?: HeaderGroupPropGetter<T>;
  getCustomHeaderProps?: HeaderPropGetter<T>;
  getCustomTableBodyProps?: TableBodyPropGetter<T>;
  getCustomRowProps?: RowPropGetter<T>;
  getCustomCellProps?: CellPropGetter<T>;
}

const defaultPropGetter = () => ({});

export const Table = <T extends object>({
  columns,
  data,
  getCustomTableProps = defaultPropGetter,
  getCustomHeaderGroupProps = defaultPropGetter,
  getCustomHeaderProps = defaultPropGetter,
  getCustomTableBodyProps = defaultPropGetter,
  getCustomRowProps = defaultPropGetter,
  getCustomCellProps = defaultPropGetter
}: TableProps<T>) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<T>({
    columns,
    data
  });

  return (
    <table {...getTableProps(getCustomTableProps)}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps(getCustomHeaderGroupProps)}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(getCustomHeaderProps)}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps(getCustomTableBodyProps)}>
        {rows.map((row, i) => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps(getCustomRowProps)}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps(getCustomCellProps)}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
