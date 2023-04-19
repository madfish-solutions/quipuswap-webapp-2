import BigNumber from 'bignumber.js';

import { STABLEDIVIDENDS_LIST_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';
import { NoPoolIdError } from '@shared/errors';
import { Nullable } from '@shared/types';

import { StableDividendsItemResponse, Version } from '../../../types';

const getStableswapItemUrl = (poolId: BigNumber, version: Version) => {
  if (version === Version.v1) {
    return `${STABLEDIVIDENDS_LIST_API_URL}/${poolId.toFixed()}`;
  }

  return `${STABLEDIVIDENDS_LIST_API_URL}/${version}/${poolId.toFixed()}`;
};

export const getStableDividendsItemApi = async (poolId: Nullable<BigNumber>, version: Version) => {
  if (!poolId) {
    throw new NoPoolIdError();
  }
  const stableswapItemUrl = getStableswapItemUrl(poolId, version);

  const data = await jsonFetch<StableDividendsItemResponse>(stableswapItemUrl);

  return data.item;
};
