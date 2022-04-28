import { observer } from 'mobx-react-lite';

import { Table } from '@shared/structures';

import { useRewardTokensListViewModel } from './reward-tokens-list.vm';

export const RewardTokensList = observer(() => {
  const { data, columns, getCustomTableProps, getCustomHeaderProps, getCustomCellProps } =
    useRewardTokensListViewModel();

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
