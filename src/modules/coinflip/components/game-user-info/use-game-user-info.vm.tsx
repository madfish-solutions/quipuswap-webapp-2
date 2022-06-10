import { ReactNode, useContext, useMemo } from 'react';

import cx from 'classnames';
import { Column, HeaderGroup, MetaBase, Cell } from 'react-table';

import { TokenRewardCell } from '@modules/farming/pages/list/components/token-reward-cell';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
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
    Header: i18n.t('common|Amount'),
    accessor: Columns.TOKEN
  },
  {
    Header: i18n.t('common|Amount'),
    accessor: Columns.AMOUNT
  }
];

const colorModes = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const getColumnProps = (id: string, colorTheme: ColorModes) => {
  if (id === Columns.TOKEN) {
    return { className: cx(styles.token, colorModes[colorTheme]) };
  } else {
    return { className: cx(styles.amount, colorModes[colorTheme]) };
  }
};

const getCustomTableProps = () => ({ className: styles.table });

const getCustomHeaderProps =
  (colorTheme: ColorModes) => (_: unknown, meta: MetaBase<Row> & { column: HeaderGroup<Row> }) =>
    getColumnProps(meta.column.id, colorTheme);

const getCustomCellProps = (colorTheme: ColorModes) => (_: unknown, meta: MetaBase<Row> & { cell: Cell<Row> }) =>
  getColumnProps(meta.cell.column.id, colorTheme);

export const useGameUserInfoViewModel = (tokensWon: Nullable<IGameUserInfo['tokensWon']>) => {
  const exchangeRates = useNewExchangeRates();
  const { colorThemeMode } = useContext(ColorThemeContext);
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
    getCustomHeaderProps: getCustomHeaderProps(colorThemeMode),
    getCustomCellProps: getCustomCellProps(colorThemeMode)
  };
};
