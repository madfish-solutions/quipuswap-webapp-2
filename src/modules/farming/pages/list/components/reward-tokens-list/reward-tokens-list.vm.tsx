import { ReactNode } from 'react';

import { Column } from 'react-table';

import { TokenInfo } from '@shared/elements';
import { i18n } from '@translation';

import { useFarmingListStore } from '../../../../hooks';
import { TokenRewardCell } from '../token-reward-cell';

export enum Columns {
  TOKEN = 'TOKEN',
  STAKED = 'STAKED',
  CLAIMABLE = 'CLAIMABLE'
}

export interface Row {
  [Columns.TOKEN]: ReactNode;
  [Columns.STAKED]: ReactNode;
  [Columns.CLAIMABLE]: ReactNode;
}

const rewardTokensColumns: Column<Row>[] = [
  {
    Header: i18n.t('farm|Token'),
    accessor: Columns.TOKEN
  },
  {
    Header: i18n.t('farm|Full'),
    accessor: Columns.STAKED
  },
  {
    Header: i18n.t('farm|Claimable'),
    accessor: Columns.CLAIMABLE
  }
];

export const useRewardTokensListViewModel = () => {
  const { tokensRewardList } = useFarmingListStore();

  const data: Array<Row> = tokensRewardList.map(tokenReward => {
    const { token, staked, claimable } = tokenReward;

    return {
      [Columns.TOKEN]: <TokenInfo token={token} />,
      [Columns.STAKED]: <TokenRewardCell {...staked} />,
      [Columns.CLAIMABLE]: <TokenRewardCell {...claimable} />
    };
  });

  return { data, columns: rewardTokensColumns };
};
