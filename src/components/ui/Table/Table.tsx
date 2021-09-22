import React, { useContext } from 'react';
import cx from 'classnames';
import { useTable } from 'react-table';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getUniqueKey } from '@utils/helpers';

import { Loader } from './Loader';
import s from './Table.module.sass';

type TablePropsT = {
  columns: any
  data: any
  loading?: boolean
  tableClassName?: string
  trClassName?: string
  thClassName?: string
  tdClassName?: string
  isLinked?: boolean
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Table: React.FC<TablePropsT> = ({
  columns,
  data,
  loading,
  tableClassName,
  trClassName,
  thClassName,
  tdClassName,
  isLinked = false,
  className,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
  );
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className={cx(s.root, modeClass[colorThemeMode], className)}>
        <div className={s.wrapper}>
          <div className={s.innerWrapper}>
            <table {...getTableProps()} className={cx(s.table, tableClassName)}>
              <thead className={s.thead}>
                {
                  headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={getUniqueKey()}
                      className={s.tr}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          key={getUniqueKey()}
                          className={cx(s.th, thClassName)}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))
                }
              </thead>
              <tbody
                {...getTableBodyProps()}
                className={cx(s.tbody, { [s.tbodyLoading]: loading })}
              >
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={getUniqueKey()}
                      className={cx(s.trContent, trClassName, { [s.isLinked]: isLinked })}
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={getUniqueKey()}
                          className={cx(s.td, tdClassName)}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
