import React, { useContext, useEffect } from 'react';
import cx from 'classnames';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getUniqueKey } from '@utils/helpers';
import { TFooter } from '@components/ui/TFooter';
import { Button } from '@components/ui/Button';
import { Preloader } from '@components/common/Preloader';
import { Skeleton } from '@components/ui/Skeleton';

import s from './Table.module.sass';

type TablePropsT = {
  theme?: keyof typeof themeClass
  columns: any
  data: any
  fieldsToSorting?: string[]
  loading?: boolean
  tableClassName?: string
  trClassName?: string
  thClassName?: string
  tdClassName?: string
  isLinked?: boolean
  className?: string
  pageSize?: number
  manualPagination?: boolean
  setOffset?: (arg: number) => void
  pageCount?: number
  disabled?: boolean
  renderMobile?: any
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const themeClass = {
  pools: s.pools,
  farms: s.farms,
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
  renderMobile,
}) => {
  const { t } = useTranslation(['common']);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize,
      },
      pageCount: Math.ceil(pageCount / (pageSize)),
      manualPagination,
      disableSortRemove: true,
      autoResetPage: false,
      disableSortBy: true,
    },
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    if (setOffset) {
      const offset = pageIndex === 0 ? pageIndex : pageIndex * (pageSize);
      setOffset(offset);
    }
  }, [pageIndex, pageSize, setOffset]);

  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    themeClass[theme],
    className,
  );

  const isShowPagination = true;

  if (loading || data.length === 0) {
    return (
      <Skeleton className={s.preloaderWrapper} />
    );
  }

  return (
    <>
      <div className={compoundClassName}>
        <div className={cx(s.wrapper, s.notMobile)}>
          <div className={s.innerWrapper}>
            <table {...getTableProps()} className={cx(s.table, tableClassName)}>
              <thead>
                {
              headerGroups.map((headerGroup:any) => (
                <tr className={s.row} key={getUniqueKey()}>
                  {headerGroup.headers.map((column:any) => {
                    const { id } = column;

                    if (
                      fieldsToSorting
                          && fieldsToSorting.length
                          && fieldsToSorting.includes(id)
                    ) {
                      return (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          key={getUniqueKey()}
                          className={s.cell}
                        >
                          <Button
                            className={s.sortingButton}
                            theme="quaternary"
                          >
                            {column.render('Header')}
                          </Button>
                        </th>
                      );
                    }

                    return (
                      <th
                        key={getUniqueKey()}
                        className={s.cell}
                      >
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </tr>
              ))
            }
              </thead>

              <tbody {...getTableBodyProps()}>
                {
                    page.map((row:any) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} key={getUniqueKey()} className={s.row}>
                          {
                              row.cells.map((cell:any) => (
                                <td
                                  {...cell.getCellProps()}
                                  key={getUniqueKey()}
                                  className={s.cell}
                                >
                                  {cell.render('Cell')}
                                </td>
                              ))
                            }
                        </tr>
                      );
                    })
                  }
              </tbody>
            </table>
            <div className={cx(
              s.footer,
              s.desktop,
              { [s.smallFooter]: !isShowPagination && pageCount !== 0 },
            )}
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
          </div>
        </div>
        <div className={cx(s.mobile, modeClass[colorThemeMode], s.table)}>
          {data.length === 0 || loading ? (
            <div className={s.preloaderWrapper}>
              <Preloader className={s.preloader} />
            </div>
          ) : (

            page.map((row:any) => {
              prepareRow(row);
              return renderMobile && renderMobile(row.original);
            })
          )}
        </div>
        {disabled && (
        <div className={cx(s.disabled, modeClass[colorThemeMode])}>
          <div className={s.disabledBg} />
          <h2 className={s.h1}>{t('common|Coming soon!')}</h2>
        </div>
        )}
      </div>
      {!disabled && (
        <div className={cx(
          s.footer,
          s.mobileFooter,
          modeClass[colorThemeMode],
          { [s.smallFooter]: !isShowPagination && pageCount !== 0 },
        )}
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
