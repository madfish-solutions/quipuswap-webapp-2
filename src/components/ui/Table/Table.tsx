import React, { useContext, useEffect } from 'react';
import cx from 'classnames';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getUniqueKey } from '@utils/helpers';
import { TFooter } from '@components/ui/TFooter';
import { Button } from '@components/ui/Button';
import { Skeleton } from '@components/ui/Skeleton';

import s from './Table.module.sass';
import { Loader } from './Loader';

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
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const themeClass = {
  primary: s.primary,
  secondary: s.secondary,
  pools: s.pools,
  farms: s.farms,
  topPairs: s.topPairs,
  pairsAndBakers: s.pairsAndBakers,
  informationOfAChosenPair: s.informationOfAChosenPair,
  accounts: s.accounts,
  bakingRewards: s.bakingRewards,
  rewardsHistory: s.rewardsHistory,
  topLiquidityPositions: s.topLiquidityPositions,
  pairs: s.pairs,
};

export const Table: React.FC<TablePropsT> = ({
  theme = 'primary',
  columns,
  data,
  fieldsToSorting,
  loading,
  tableClassName,
  pageSize = 10,
  // nameOfTable,
  manualPagination = true,
  setOffset,
  pageCount = 0,
  className,
  disabled = false,
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

  if (loading) {
    return <Loader />;
  }

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    themeClass[theme],
    className,
  );

  const isShowPagination = true;

  return (
    <div className={s.table}>
      <div className={compoundClassName}>
        <div className={s.wrapper}>
          <div className={s.innerWrapper}>
            <table {...getTableProps()} className={cx(s.table, tableClassName)}>
              <thead>
                {
              headerGroups.map((headerGroup:any) => (
                <tr key={getUniqueKey()}>
                  <th className={cx(s.row)}>
                    {headerGroup.headers.map((column:any) => {
                      const { id } = column;

                      if (
                        fieldsToSorting
                          && fieldsToSorting.length
                          && fieldsToSorting.includes(id)
                      ) {
                        return (
                          <div
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            key={getUniqueKey()}
                            className={cx(s.cell)}
                          >
                            <Button
                              className={cx(s.sortingButton)}
                              theme="quaternary"
                            >
                              {column.render('Header')}
                            </Button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={getUniqueKey()}
                          className={cx(s.cell)}
                        >
                          {column.render('Header')}
                        </div>
                      );
                    })}
                  </th>
                </tr>
              ))
            }
              </thead>
              {data.length === 0 || loading ? (
                <div className={s.preloaderWrapper}>
                  <Skeleton className={s.preloader} />
                </div>
              ) : (
                <tbody {...getTableBodyProps()}>
                  {
                    page.map((row:any) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} key={getUniqueKey()}>
                          <td className={cx(s.row)}>
                            {
                              row.cells.map((cell:any) => (
                                <div
                                  {...cell.getCellProps()}
                                  key={getUniqueKey()}
                                  className={cx(s.cell)}
                                >
                                  {cell.render('Cell')}
                                </div>
                              ))
                            }
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              )}
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
      </div>
      <div className={cx(
        s.footer,
        s.mobileFooter,
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
      {disabled && (
      <div className={cx(s.disabled, modeClass[colorThemeMode])}>
        <div className={s.disabledBg} />
        <h2 className={s.h1}>{t('common:Coming soon!')}</h2>
      </div>
      )}
    </div>
  );
};
