import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  TransactionType,
} from '@utils/types';
import { Table } from '@components/ui/Table';

import s from '../Table.module.sass';
import { TransactionItem } from './TransactionItem';
import { TransactionCardItem } from './TransactionCardItem';

type TransactionTableProps = {
  data: TransactionType[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const Header = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    themeClass[colorThemeMode],
    s.tableRow,
    s.poolRow,
    s.tableHeader,
    s.tableHeaderBorder,
  );
  return (
    <th className={compoundClassName}>
      <div className={cx(s.label)}>
        Action
      </div>
      <div className={s.label}>
        Total Value
      </div>
      <div className={s.label}>
        Token A Amount
      </div>
      <div className={s.label}>
        Token B Amount
      </div>
      <div className={s.label}>
        Time
      </div>
    </th>
  );
};

const transactionTableItem = (transaction:TransactionType) => (
  <TransactionItem
    key={transaction.id}
    transaction={transaction}
  />
);

const transactionMobileItem = (transaction:TransactionType) => (
  <TransactionCardItem
    key={transaction.id}
    transaction={transaction}
  />
);

export const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
}) => (
  <Table
    data={data}
    renderTableData={transactionTableItem}
    renderMobileData={transactionMobileItem}
    header={<Header />}
  />
);
