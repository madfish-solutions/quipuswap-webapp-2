import BigNumber from 'bignumber.js';

import { STALKING_API_URL } from '@app.config';
import { StakeItemResponse } from '@interfaces/staking.interfaces';
import { Nullable } from '@utils/types';

const STALKING_LIST_API_URL = `${STALKING_API_URL}/list`;

export const getStakingItemApi = async (stakingId: Nullable<BigNumber>, accountPkh: Nullable<string>) => {
  if (!stakingId) {
    throw new Error('Failed to get nullable stakingId');
  }

  const response = await fetch(`${STALKING_LIST_API_URL}/${stakingId.toFixed()}`);

  const data = (await response.json()) as StakeItemResponse;

  return data.item;
};
