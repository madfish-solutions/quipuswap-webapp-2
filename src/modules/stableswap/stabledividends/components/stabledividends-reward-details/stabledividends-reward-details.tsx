import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Table } from '@shared/structures';

import { useStableDividendsRewardDetailsViewModel } from './stabledividends-reward-details.vm';
import { StableDividendsRewardProps } from './types';

export const StableDividendsRewardDetails: FC<StableDividendsRewardProps> = observer(props => {
  const { data, columns, getCustomTableProps, getCustomHeaderProps, getCustomCellProps } =
    useStableDividendsRewardDetailsViewModel(props);

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
