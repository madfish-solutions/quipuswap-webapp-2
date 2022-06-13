import { FC } from 'react';

import { TokenWon } from '@modules/coinflip/types';
import { Table } from '@shared/structures';

import { useGameUserInfoViewModel } from './use-game-user-info.vm';

interface Props {
  tokensWon: Nullable<TokenWon[]>;
}

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
