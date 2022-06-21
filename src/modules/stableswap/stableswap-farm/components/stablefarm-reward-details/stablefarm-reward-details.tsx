import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Table } from '@shared/structures';

import { useStableFarmRewardDetailsViewModel } from './stablefarm-reward-details.vm';
import { StableFarmRewardProps } from './types';

export const StableFarmRewardDetails: FC<StableFarmRewardProps> = observer(props => {
  const { data, columns, getCustomTableProps, getCustomHeaderProps, getCustomCellProps } =
    useStableFarmRewardDetailsViewModel(props);

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
