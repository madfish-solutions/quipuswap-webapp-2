import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  PoolTableType,
} from '@utils/types';
import { Table } from '@components/ui/Table';
import { Tooltip } from '@components/ui/Tooltip';

import s from './PoolTable.module.sass';
import { PoolItem } from './PoolItem';
import { PoolCardItem } from './PoolCardItem';
import { PoolItemSkeleton } from './PoolItemSkeleton';
import { PoolCardItemSkeleton } from './PoolCardItemSkeleton';

type PoolTableProps = {
  data: PoolTableType[]
  loading: boolean
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const Header = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['home']);
  const compoundClassName = cx(
    themeClass[colorThemeMode],
    s.tableRow,
    s.farmRow,
    s.tableHeader,
    s.tableHeaderBorder,
  );
  return (
    <th className={compoundClassName}>
      <div className={s.label}>
        {t('home:Name')}
      </div>
      <div className={s.label}>
        {t('home:TVL')}
        <Tooltip sizeT="small" content={t('home:TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
      </div>
      <div className={s.label}>
        {t('home:Volume 24h')}
        <Tooltip sizeT="small" content={t('home:A total amount of funds that were swapped via each pool today.')} />
      </div>
      <div className={s.label} />
    </th>
  );
};

const poolTableItem = (pool:PoolTableType) => (
  <PoolItem
    key={pool.pair.name}
    pool={pool}
  />
);

const poolMobileItem = (pool:PoolTableType) => (
  <PoolCardItem
    key={pool.pair.name}
    pool={pool}
  />
);

const poolTableItemSkeleton = (id: number) => (
  <PoolItemSkeleton
    key={id}
  />
);

const poolMobileItemSkeleton = (id: number) => (
  <PoolCardItemSkeleton
    key={id}
  />
);

export const PoolTable: React.FC<PoolTableProps> = ({
  data,
  loading,
}) => (
  <Table
    data={loading ? [1, 2, 3, 4, 5] : data}
    renderTableData={loading ? poolTableItemSkeleton : poolTableItem}
    renderMobileData={loading ? poolMobileItemSkeleton : poolMobileItem}
    header={<Header />}
  />
);
