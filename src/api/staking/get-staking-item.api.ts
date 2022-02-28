import BigNumber from 'bignumber.js';

import { STALKING_API_URL } from '@app.config';
import { RawStakingItem } from '@interfaces/staking.interfaces';
import { Nullable } from '@utils/types';

const STALKING_LIST_API_URL = `${STALKING_API_URL}/list`;

export const getStakingItemApi = async (stakingId: Nullable<BigNumber>, accountPkh: Nullable<string>) => {
  console.log('getStakingItemApi', stakingId?.toFixed(), accountPkh);
  if (!stakingId) {
    throw new Error('Failed to get nullable stakingId');
  }
  const headers = new Headers({
    'content-type': 'application/json'
  });
  if (accountPkh) {
    headers.append('account-pkh', accountPkh);
  }
  const res = await fetch(`${STALKING_LIST_API_URL}/${stakingId.toFixed()}`, {
    headers
  });

  return (await res.json()) as RawStakingItem;
};
