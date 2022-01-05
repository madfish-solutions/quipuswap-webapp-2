import React, { useContext, useEffect, useState } from 'react';

import { ColorModes, ColorThemeContext, Table } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { MAX_ITEMS_PER_PAGE } from '@app.config';
import { useColumns } from '@components/tables/PoolTable/hooks';
import { PoolTableType } from '@utils/types';

import { PoolCardItem } from './PoolCardItem';
import s from './PoolTable.module.sass';

interface PoolTableProps {
  data?: PoolTableType;
  totalCount?: number;
  exchangeRate?: string;
  loading?: boolean;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: any;
}

const pageSize = MAX_ITEMS_PER_PAGE;

const poolMobileItem = (pool: PoolTableType) => <PoolCardItem key={pool.pair.name} pool={pool} />;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PoolTable: React.FC<PoolTableProps> = ({ data, totalCount, loading = true, className, fetch }) => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [offset, setOffset] = useState(0);

  const { colorThemeMode } = useContext(ColorThemeContext);

  useEffect(() => {
    if (totalCount) {
      setPageCount(totalCount);
    }
  }, [totalCount]);

  useEffect(() => {
    fetch({
      variables: {
        limit: pageSize ?? 10,
        offset
      }
    });
  }, [fetch, offset]);

  const columns = useColumns();

  return (
    <Table
      theme="pools"
      className={cx(className, modeClass[colorThemeMode])}
      tableClassName={s.table}
      renderMobile={poolMobileItem}
      data={data ?? []}
      loading={loading}
      columns={columns}
      trClassName={s.tr}
      thClassName={s.th}
      tdClassName={s.td}
      pageCount={pageCount}
      pageSize={pageSize ?? 10}
      setOffset={setOffset}
      isLinked
    />
  );
};
