import { ReactNode, useMemo } from 'react';

import { Cell, Column, HeaderGroup, MetaBase } from 'react-table';

import { TokenInfo } from '@shared/elements';
import { isTokenEqual, multipliedIfPossible } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';
import { i18n } from '@translation';

import { useV3PositionsViewModel } from '../../use-v3-positions.vm';
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

export const useFeeTokensListViewModel = () => {
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { positions } = useV3PositionsViewModel();

  const data: Row[] = useMemo(() => {
    const feesAddends = positions
      .map(({ inputToken, tokenXDeposit, tokenXFees, tokenYDeposit, tokenYFees }) => {
        const [tokenX, tokenY] = inputToken;

        return [
          { token: tokenX, deposit: tokenXDeposit, fee: tokenXFees },
          { token: tokenY, deposit: tokenYDeposit, fee: tokenYFees }
        ];
      })
      .flat();

    const feesByTokens = feesAddends.reduce<typeof feesAddends>((acc, { token: currentToken, deposit, fee }) => {
      const existentTokenSum = acc.find(({ token }) => isTokenEqual(token, currentToken));

      if (existentTokenSum) {
        existentTokenSum.deposit = existentTokenSum.deposit.plus(deposit);
        existentTokenSum.fee = existentTokenSum.fee.plus(fee);
      } else {
        acc.push({ token: currentToken, deposit, fee });
      }

      return acc;
    }, []);

    return feesByTokens.map(({ token, deposit, fee }) => {
      const exchangeRate = getTokenExchangeRate(token);
      const depositDollarEquivalent = multipliedIfPossible(deposit, exchangeRate);
      const feeDollarEquivalent = multipliedIfPossible(fee, exchangeRate);

      return {
        [Columns.TOKEN]: <TokenInfo token={token} />,
        [Columns.DEPOSIT]: <TokenFeeCell amount={deposit} dollarEquivalent={depositDollarEquivalent} />,
        [Columns.FEE]: <TokenFeeCell amount={fee} dollarEquivalent={feeDollarEquivalent} />
      };
    });
  }, [positions, getTokenExchangeRate]);

  return {
    data,
    columns: rewardTokensColumns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomCellProps
  };
};
