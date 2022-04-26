import { observer } from 'mobx-react-lite';
import { HeaderGroup, MetaBase, TableHeaderProps, TableCellProps, Cell } from 'react-table';

import { Table } from '@shared/structures';

import styles from './reward-tokens-list.module.scss';
import { Columns, Row, useRewardTokensListViewModel } from './reward-tokens-list.vm';

export const RewardTokensList = observer(() => {
  const { data, columns } = useRewardTokensListViewModel();
  const getCustomTableProps = { className: styles.table };
  const getCustomHeaderProps = (
    _: Partial<TableHeaderProps>,
    meta: MetaBase<Row> & {
      column: HeaderGroup<Row>;
    }
  ) => {
    if (meta.column.id === Columns.TOKEN) {
      return { className: styles.token };
    } else {
      return { className: styles.amount };
    }
  };

  const getCustomCellProps = (
    _: Partial<TableCellProps>,
    meta: MetaBase<Row> & {
      cell: Cell<Row>;
    }
  ) => {
    if (meta.cell.column.id === Columns.TOKEN) {
      return { className: styles.token };
    } else {
      return { className: styles.amount };
    }
  };

  return (
    <Table
      getCustomTableProps={getCustomTableProps}
      getCustomHeaderProps={getCustomHeaderProps}
      getCustomCellProps={getCustomCellProps}
      data={data}
      columns={columns}
    />
  );
});
