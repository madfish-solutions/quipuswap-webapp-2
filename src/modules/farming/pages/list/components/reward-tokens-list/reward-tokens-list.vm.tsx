import { ReactNode } from 'react';

import { Column, HeaderGroup, MetaBase, Cell } from 'react-table';

import { TokenInfo } from '@shared/elements';
import { i18n } from '@translation';

import { useFarmingListStore } from '../../../../hooks';
import { TokenRewardCell } from '../token-reward-cell';
import styles from './reward-tokens-list.module.scss';

enum Columns {
  TOKEN = 'TOKEN',
  STAKED = 'STAKED',
  CLAIMABLE = 'CLAIMABLE'
}

export interface Row {
  [Columns.TOKEN]: ReactNode;
  [Columns.STAKED]: ReactNode;
  [Columns.CLAIMABLE]: ReactNode;
}

const rewardTokensColumns: Column<Row>[] = [
  {
    Header: i18n.t('farm|Token'),
    accessor: Columns.TOKEN
  },
  {
    Header: i18n.t('farm|Full'),
    accessor: Columns.STAKED
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

export const useRewardTokensListViewModel = () => {
  const { tokensRewardList } = useFarmingListStore();

  const data: Array<Row> = tokensRewardList.map(({ token, staked, claimable }) => {
    return {
      [Columns.TOKEN]: <TokenInfo token={token} />,
      [Columns.STAKED]: <TokenRewardCell {...staked} />,
      [Columns.CLAIMABLE]: <TokenRewardCell {...claimable} />
    };
  });

  return {
    data,
    columns: rewardTokensColumns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomCellProps
  };
};
