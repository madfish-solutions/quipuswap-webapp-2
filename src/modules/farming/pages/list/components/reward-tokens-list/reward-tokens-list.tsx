import { observer } from 'mobx-react-lite';
import { HeaderGroup, MetaBase, Cell } from 'react-table';

import { Table } from '@shared/structures';

import styles from './reward-tokens-list.module.scss';
import { Columns, Row, useRewardTokensListViewModel } from './reward-tokens-list.vm';

const getColumnProps = (id: string) => {
  if (id === Columns.TOKEN) {
    return { className: styles.token };
  } else {
    return { className: styles.amount };
  }
};

const getCustomHeaderProps = (_: unknown, meta: MetaBase<Row> & { column: HeaderGroup<Row> }) =>
  getColumnProps(meta.column.id);

const getCustomCellProps = (_: unknown, meta: MetaBase<Row> & { cell: Cell<Row> }) =>
  getColumnProps(meta.cell.column.id);

export const RewardTokensList = observer(() => {
  const { data, columns } = useRewardTokensListViewModel();
  const getCustomTableProps = { className: styles.table };

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
