import React, { useContext, useEffect } from 'react';

import { ColorModes, ColorThemeContext, Preloader, TFooter } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Skeleton } from '@components/common/Skeleton';
import { poolMobileItem } from '@components/tables/PoolTable';
import { useColumns } from '@components/tables/PoolTable/hooks';
import { Button } from '@components/ui/elements/button';
import { PoolTableType } from '@interfaces/types';
import { getUniqueKey, isEmptyArray } from '@utils/helpers';
import { usePagination, useSortBy, useTable } from 'react-table';

import s from './table.module.sass';

interface TablePropsT {
  theme?: keyof typeof themeClass;
  columns: ReturnType<typeof useColumns>;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  fieldsToSorting?: string[];
  loading?: boolean;
  tableClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tdClassName?: string;
  isLinked?: boolean;
  className?: string;
  pageSize?: number;
  manualPagination?: boolean;
  setOffset?: (arg: number) => void;
  pageCount?: number;
  disabled?: boolean;
  disabledLabel?: string;
  renderMobile?: typeof poolMobileItem;
}

interface Row {
  // eslint-disable-next-line
  getRowProps: () => any;
  // eslint-disable-next-line
  cells: Array<{ getCellProps: () => any; render: (a: string) => any }>;
}

interface Columns {
  id: string;
  // eslint-disable-next-line
  getHeaderProps: (a: any) => any;
  // eslint-disable-next-line
  getSortByToggleProps: () => any;
  // eslint-disable-next-line
  render: (a: string) => any;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

const themeClass = {
  pools: s.pools,
  farms: s.farms
};

export const Table: React.FC<TablePropsT> = ({
  theme = 'pools',
  columns,
  data,
  fieldsToSorting,
  loading,
  tableClassName,
  pageSize = 10,
  manualPagination = true,
  setOffset,
  pageCount = 0,
  className,
  disabled = false,
  disabledLabel = 'Coming soon!',
  renderMobile
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize
      },
      pageCount: Math.ceil(pageCount / pageSize),
      manualPagination,
      disableSortRemove: true,
      autoResetPage: false,
      disableSortBy: true
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (setOffset) {
      const offset = pageIndex === 0 ? pageIndex : pageIndex * pageSize;
      setOffset(offset);
    }
  }, [pageIndex, pageSize, setOffset]);

  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(s.root, modeClass[colorThemeMode], themeClass[theme], className);

  const isShowPagination = true;

  if (loading || isEmptyArray(data)) {
    return <Skeleton className={s.preloaderWrapper} />;
  }

  return (
    <>
      <div className={compoundClassName}>
        <div className={cx(s.wrapper, s.notMobile)}>
          <div className={s.innerWrapper}>
            <table {...getTableProps()} className={cx(s.table, tableClassName)}>
              <thead>
                {headerGroups.map((headerGroup: { headers: Array<Columns> }) => (
                  <tr className={cx(s.row)} key={getUniqueKey()}>
                    {headerGroup.headers.map(column => {
                      const { id } = column;

                      if (fieldsToSorting && fieldsToSorting.length && fieldsToSorting.includes(id)) {
                        return (
                          <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            key={getUniqueKey()}
                            className={cx(s.cell)}
                          >
                            <Button className={cx(s.sortingButton)} theme="quaternary">
                              {column.render('Header')}
                            </Button>
                          </th>
                        );
                      }

                      return (
                        <th key={getUniqueKey()} className={cx(s.cell)}>
                          {column.render('Header')}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {(page as Array<Row>).map(row => {
                  prepareRow(row);

                  return (
                    <tr {...row.getRowProps()} key={getUniqueKey()} className={cx(s.row)}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} key={getUniqueKey()} className={cx(s.cell)}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={cx(s.footer, s.desktop, { [s.smallFooter]: !isShowPagination && !pageCount })}>
              <TFooter
                isShowPagination={isShowPagination}
                previousPage={previousPage}
                canPreviousPage={canPreviousPage}
                pageIndex={pageIndex}
                pageOptions={pageOptions}
                nextPage={nextPage}
                canNextPage={canNextPage}
              />
            </div>
          </div>
        </div>
        <div className={cx(s.mobile, modeClass[colorThemeMode], s.table)}>
          {isEmptyArray(data) || loading ? (
            <div className={s.preloaderWrapper}>
              <Preloader className={s.preloader} />
            </div>
          ) : (
            (page as Array<{ original: PoolTableType }>).map(row => {
              prepareRow(row);

              return renderMobile && renderMobile(row.original);
            })
          )}
        </div>
        {disabled && (
          <div className={cx(s.disabled, modeClass[colorThemeMode])}>
            <div className={s.disabledBg} />
            <h2 className={s.h1}>{disabledLabel}</h2>
          </div>
        )}
      </div>
      {!disabled && (
        <div
          className={cx(s.footer, s.mobileFooter, modeClass[colorThemeMode], {
            [s.smallFooter]: !isShowPagination && !pageCount
          })}
        >
          <TFooter
            isShowPagination={isShowPagination}
            previousPage={previousPage}
            canPreviousPage={canPreviousPage}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            nextPage={nextPage}
            canNextPage={canNextPage}
          />
        </div>
      )}
    </>
  );
};
