import { ReactNode } from 'react';

import { Column, HeaderGroup, MetaBase, Cell } from 'react-table';

//TODO: move to shared
import { TokenRewardCell } from '@modules/farming/pages/list/components/token-reward-cell';
import { TokenInfo } from '@shared/elements';
import { i18n } from '@translation';

import styles from './stablefarm-reward-details.module.scss';
import { StableDividendsRewardProps } from './types';

enum Columns {
  TOKEN = 'TOKEN',
  CLAIMABLE = 'CLAIMABLE'
}

export interface Row {
  [Columns.TOKEN]: ReactNode;
  [Columns.CLAIMABLE]: ReactNode;
}

const rewardTokensColumns: Column<Row>[] = [
  {
    Header: i18n.t('farm|Token'),
    accessor: Columns.TOKEN
  },
  {
    Header: i18n.t('farm|Claimable'),
    accessor: Columns.CLAIMABLE
  }
];

const getColumnProps = (id: string) => {
  if (id === Columns.TOKEN) {
    return { className: styles.token };
  } else {
    return { className: styles.amount };
  }
};

const getCustomTableProps = () => ({ className: styles.table });

const getCustomHeaderProps = (_: unknown, meta: MetaBase<Row> & { column: HeaderGroup<Row> }) =>
  getColumnProps(meta.column.id);

const getCustomCellProps = (_: unknown, meta: MetaBase<Row> & { cell: Cell<Row> }) =>
  getColumnProps(meta.cell.column.id);

export const useStableDividendsRewardDetailsViewModel = ({ rawData }: StableDividendsRewardProps) => {
  const data: Array<Row> = rawData.map(({ token, claimable }) => ({
    [Columns.TOKEN]: <TokenInfo token={token} />,
    [Columns.CLAIMABLE]: <TokenRewardCell {...claimable} />
  }));

  return {
    data,
    columns: rewardTokensColumns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomCellProps
  };
};
