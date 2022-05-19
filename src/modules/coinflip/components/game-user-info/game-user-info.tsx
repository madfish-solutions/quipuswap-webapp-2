import { FC } from 'react';

import { Table } from '@shared/structures';
import { NullableField } from '@shared/types';

import { GameUserInfo as IGameUserInfo } from '../../types';
import { useGameUserInfoViewModel } from './use-game-user-info.vm';

type Props = NullableField<Pick<IGameUserInfo, 'tokensWon'>>;

export const GameUserInfo: FC<Props> = ({ tokensWon }) => {
  const { data, columns, getCustomTableProps, getCustomHeaderProps, getCustomCellProps } =
    useGameUserInfoViewModel(tokensWon);

  return (
    <Table
      getCustomTableProps={getCustomTableProps}
      getCustomHeaderProps={getCustomHeaderProps}
      getCustomCellProps={getCustomCellProps}
      data={data}
      columns={columns}
    />
  );
};
