import { ReactNode, useMemo } from 'react';

import { Cell, Column, HeaderGroup, MetaBase } from 'react-table';

import { useLiquidityV3PositionStore } from '@modules/liquidity/hooks';
import { TokenInfo } from '@shared/elements';
import { multipliedIfPossible, isNull } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';
import { i18n } from '@translation';

import { findUserPosition } from '../../helpers';
import { useUserInfoRows } from '../../hooks';
import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { TokenFeeCell } from '../token-fee-cell';
import styles from './position-fee-tokens-list.module.scss';

enum Columns {
  TOKEN = 'TOKEN',
  DEPOSIT = 'DEPOSIT',
  FEE = 'FEE'
}

export interface Row {
  [Columns.TOKEN]: ReactNode;
  [Columns.DEPOSIT]: ReactNode;
  [Columns.FEE]: ReactNode;
}

const rewardTokensColumns: Column<Row>[] = [
  {
    Header: i18n.t('liquidity|Token'),
    accessor: Columns.TOKEN
  },
  {
    Header: i18n.t('liquidity|Deposit'),
    accessor: Columns.DEPOSIT
  },
  {
    Header: i18n.t('liquidity|Fee'),
    accessor: Columns.FEE
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

export const usePositionFeeTokensListViewModel = () => {
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { getUserInfoRows } = useUserInfoRows();

  const userPosition = findUserPosition(positionsWithStats, positionId);

  const rows: Row[] = useMemo(() => {
    if (isNull(positionId)) {
      return [];
    }

    const userDepositWithFees = getUserInfoRows(userPosition);

    return userDepositWithFees.map(({ token, deposit, fee }) => {
      const exchangeRate = getTokenExchangeRate(token);
      const depositDollarEquivalent = multipliedIfPossible(deposit, exchangeRate);
      const feeDollarEquivalent = multipliedIfPossible(fee, exchangeRate);

      return {
        [Columns.TOKEN]: <TokenInfo token={token} />,
        [Columns.DEPOSIT]: <TokenFeeCell amount={deposit} dollarEquivalent={depositDollarEquivalent} />,
        [Columns.FEE]: <TokenFeeCell amount={fee} dollarEquivalent={feeDollarEquivalent} />
      };
    });
  }, [getTokenExchangeRate, getUserInfoRows, positionId, userPosition]);

  return {
    data: rows,
    columns: rewardTokensColumns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomCellProps
  };
};
