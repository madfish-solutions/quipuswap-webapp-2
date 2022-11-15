import { BigNumber } from 'bignumber.js';

import { isExist, tokenMatchesSearch } from '@shared/helpers';
import { ActiveStatus, Nullable } from '@shared/types';

import { FarmingListItemWithBalances } from '../pages/list/types';

export const filterByActiveOnly =
  (activeOnly: boolean) =>
  ({ stakeStatus }: FarmingListItemWithBalances) =>
    activeOnly ? stakeStatus === ActiveStatus.ACTIVE : true;

export const filterByStakedOnly =
  (stakedOnly: boolean, accountPkh: Nullable<string>) => (farming: FarmingListItemWithBalances) =>
    stakedOnly && isExist(accountPkh)
      ? isExist(farming.depositBalance) && farming.depositBalance.isGreaterThan('0')
      : true;

export const filterBySearch =
  (search: string, tokenId: Nullable<BigNumber>) =>
  ({ stakedToken, rewardToken, tokens }: FarmingListItemWithBalances) =>
    search
      ? tokenMatchesSearch(stakedToken, search, tokenId, true) ||
        tokenMatchesSearch(rewardToken, search, tokenId) ||
        tokens.some(token => tokenMatchesSearch(token, search, tokenId))
      : true;
