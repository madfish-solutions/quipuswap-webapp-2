import { BigNumber } from 'bignumber.js';

import { isExist, SortDirection, tokenMatchesSearch } from '@shared/helpers';
import { ActiveStatus, Nullable } from '@shared/types';

import { sortFarmingList } from '../pages/list/helpers';
import { FarmingListItemWithBalances, FarmingSortField } from '../pages/list/types';

interface Params {
  activeOnly: boolean;
  stakedOnly: boolean;
  sortField: FarmingSortField;
  sortDirection: SortDirection;
  search: string;
  tokenId: Nullable<BigNumber>;
  accountPkh: Nullable<string>;
}

export const filterAndOrderFarmings = (
  farmings: FarmingListItemWithBalances[],
  { activeOnly, stakedOnly, sortField, sortDirection, search, tokenId, accountPkh }: Params
) => {
  let list = [...farmings];

  if (stakedOnly && isExist(accountPkh)) {
    list = list.filter(localItem => isExist(localItem.depositBalance) && localItem.depositBalance.isGreaterThan('0'));
  }

  if (activeOnly) {
    list = list.filter(({ stakeStatus }) => stakeStatus === ActiveStatus.ACTIVE);
  }

  if (search) {
    list = list.filter(
      ({ stakedToken, rewardToken, tokens }) =>
        tokenMatchesSearch(stakedToken, search, tokenId, true) ||
        tokenMatchesSearch(rewardToken, search, tokenId) ||
        tokens.some(token => tokenMatchesSearch(token, search, tokenId))
    );
  }

  return sortFarmingList(list, sortField, sortDirection);
};
