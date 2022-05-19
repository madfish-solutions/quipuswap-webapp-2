import { ReactNode, useMemo } from 'react';

import { Column, HeaderGroup, MetaBase, Cell } from 'react-table';

import { TokenRewardCell } from '@modules/farming/pages/list/components/token-reward-cell';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { TokenInfo } from '@shared/elements';
import { getTokenSlug, multipliedIfPossible } from '@shared/helpers';
import { Standard } from '@shared/types';
import { i18n } from '@translation';

import { GameUserInfo as IGameUserInfo } from '../../types';
import styles from './game-user-info.module.scss';

enum Columns {
  TOKEN = 'TOKEN',
  AMOUNT = 'AMOUNT'
}

export interface Row {
  [Columns.TOKEN]: ReactNode;
  [Columns.AMOUNT]: ReactNode;
}

const rewardTokensColumns: Column<Row>[] = [
  {
    Header: i18n.t('common|Token'),
    accessor: Columns.TOKEN
  },
  {
    Header: i18n.t('common|Amount'),
    accessor: Columns.AMOUNT
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

export const useGameUserInfoViewModel = (tokensWon: Nullable<IGameUserInfo['tokensWon']>) => {
  const exchangeRates = useNewExchangeRates();
  const data: Array<Row> = useMemo(() => {
    return (tokensWon ?? []).map(({ token, amount }) => {
      const { contractAddress, fa2TokenId } = token;
      const tokenSlug = getTokenSlug({
        contractAddress: contractAddress,
        fa2TokenId: fa2TokenId,
        type: fa2TokenId === undefined ? Standard.Fa12 : Standard.Fa2
      });
      const tokenExchangeRate = exchangeRates[tokenSlug];

      const dollarEquivalent = multipliedIfPossible(amount, tokenExchangeRate);

      return {
        [Columns.TOKEN]: <TokenInfo token={token} />,
        [Columns.AMOUNT]: <TokenRewardCell amount={amount} dollarEquivalent={dollarEquivalent} />
      };
    });
  }, [exchangeRates, tokensWon]);

  return {
    data,
    columns: rewardTokensColumns,
    getCustomTableProps,
    getCustomHeaderProps,
    getCustomCellProps
  };
};
