import { ReactNode, useMemo } from 'react';

import { Cell, Column, HeaderGroup, MetaBase } from 'react-table';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE } from '@config/constants';
import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { TokenInfo } from '@shared/elements';
import { isExist, isGreaterThanZero, isTokenEqual, multipliedIfPossible } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';
import { i18n } from '@translation';

import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { TokenFeeCell } from '../token-fee-cell';
import styles from './positions-fee-tokens-list.module.scss';

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

export const usePositionsFeeTokensListViewModel = () => {
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { positionsWithStats } = usePositionsWithStats();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const data: Row[] = useMemo(() => {
    if (!isExist(tokenX) || !isExist(tokenY)) {
      return [];
    }

    const feesAddends = positionsWithStats
      .map(({ stats }) => {
        const { tokenXDeposit, tokenXFees, tokenYDeposit, tokenYFees } = stats;

        return [
          { token: tokenX, deposit: tokenXDeposit, fee: tokenXFees },
          { token: tokenY, deposit: tokenYDeposit, fee: tokenYFees }
        ];
      })
      .flat()
      .filter(({ fee }) => isGreaterThanZero(fee));

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
      const exchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(token) : TESTNET_EXCHANGE_RATE;
      const depositDollarEquivalent = multipliedIfPossible(deposit, exchangeRate);
      const feeDollarEquivalent = multipliedIfPossible(fee, exchangeRate);

      return {
        [Columns.TOKEN]: <TokenInfo token={token} />,
        [Columns.DEPOSIT]: <TokenFeeCell amount={deposit} dollarEquivalent={depositDollarEquivalent} />,
        [Columns.FEE]: <TokenFeeCell amount={fee} dollarEquivalent={feeDollarEquivalent} />
      };
    });
  }, [positionsWithStats, getTokenExchangeRate, tokenX, tokenY]);

  return {
    data,
    columns: rewardTokensColumns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomCellProps
  };
};
