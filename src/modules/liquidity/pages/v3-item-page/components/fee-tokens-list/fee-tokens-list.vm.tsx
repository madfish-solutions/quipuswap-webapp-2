import { ReactNode, useMemo } from 'react';

import { Cell, Column, HeaderGroup, MetaBase, Row as TableRow } from 'react-table';

import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { TokenInfo } from '@shared/elements';
import { isExist, isGreaterThanZero, isTokenEqual, multipliedIfPossible } from '@shared/helpers';
import { i18n } from '@translation';

import { usePositionsWithStats, useLiquidityV3ItemTokensExchangeRates } from '../../hooks';
import { TokenFeeCell } from '../token-fee-cell';
import styles from './fee-tokens-list.module.scss';

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
    return { className: styles.token, key: id };
  } else {
    return { className: styles.amount, key: id };
  }
};

const getCustomTableProps = () => ({ className: styles.table });

const getCustomHeaderProps = (_: unknown, meta: MetaBase<Row> & { column: HeaderGroup<Row> }) =>
  getColumnProps(meta.column.id);

const getCustomCellProps = (_: unknown, meta: MetaBase<Row> & { cell: Cell<Row> }) =>
  getColumnProps(meta.cell.column.id);

const getCustomHeaderGroupProps = (_: unknown, meta: MetaBase<Row> & { column: HeaderGroup<Row> }) => ({
  key: meta.userProps.name
});

const getCustomRowProps = (_: unknown, meta: MetaBase<Row> & { row: TableRow<Row> }) => ({
  key: meta.row.index
});

export const useFeeTokensListViewModel = () => {
  const { positionsWithStats } = usePositionsWithStats();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tokenXExchangeRate, tokenYExchangeRate, isExchangeRatesError } = useLiquidityV3ItemTokensExchangeRates();

  const rows: Row[] = useMemo(() => {
    if (!isExist(tokenX) || !isExist(tokenY)) {
      return [];
    }

    const feesAddends = positionsWithStats
      .map(({ stats }) => {
        const { tokenXDeposit, tokenXFees, tokenYDeposit, tokenYFees } = stats;

        return [
          { token: tokenX, deposit: tokenXDeposit, fee: tokenXFees, exchangeRate: tokenXExchangeRate },
          { token: tokenY, deposit: tokenYDeposit, fee: tokenYFees, exchangeRate: tokenYExchangeRate }
        ];
      })
      .flat();

    const feesByTokens = feesAddends
      .reduce<typeof feesAddends>((acc, { token: currentToken, deposit, fee, exchangeRate }) => {
        const existentTokenSum = acc.find(({ token }) => isTokenEqual(token, currentToken));

        if (existentTokenSum) {
          existentTokenSum.deposit = existentTokenSum.deposit.plus(deposit);
          existentTokenSum.fee = existentTokenSum.fee.plus(fee);
        } else {
          acc.push({ token: currentToken, deposit, fee, exchangeRate });
        }

        return acc;
      }, [])
      .filter(({ fee }) => isGreaterThanZero(fee));

    return feesByTokens.map(({ token, deposit, fee, exchangeRate }) => {
      const depositDollarEquivalent = multipliedIfPossible(deposit, exchangeRate);
      const feeDollarEquivalent = multipliedIfPossible(fee, exchangeRate);

      return {
        [Columns.TOKEN]: <TokenInfo token={token} />,
        [Columns.DEPOSIT]: (
          <TokenFeeCell
            amount={deposit}
            dollarEquivalent={depositDollarEquivalent}
            isExchangeRatesError={isExchangeRatesError}
          />
        ),
        [Columns.FEE]: (
          <TokenFeeCell
            amount={fee}
            dollarEquivalent={feeDollarEquivalent}
            isExchangeRatesError={isExchangeRatesError}
          />
        )
      };
    });
  }, [positionsWithStats, tokenX, tokenXExchangeRate, tokenY, tokenYExchangeRate, isExchangeRatesError]);

  return {
    rows,
    columns: rewardTokensColumns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomHeaderGroupProps,
    getCustomCellProps,
    getCustomRowProps
  };
};
