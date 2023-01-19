import BigNumber from 'bignumber.js';

import { STABLESWAP_LIST_API_URL } from '@config/constants';
import { NoPoolIdError } from '@shared/errors';
import { Nullable } from '@shared/types';

import { StableswapItemResponse, Version } from '../types';

const getStableswapItemUrl = (poolId: BigNumber, version: Version) => {
  if (version === Version.v1) {
    return `${STABLESWAP_LIST_API_URL}/${poolId.toFixed()}`;
  }

  return `${STABLESWAP_LIST_API_URL}/${version}/${poolId.toFixed()}`;
};

export const getStableswapItemApi = async (poolId: Nullable<BigNumber>, version: Nullable<Version>) => {
  if (!poolId || !version) {
    throw new NoPoolIdError();
  }

  const stableswapItemUrl = getStableswapItemUrl(poolId, version);

  const response = await fetch(stableswapItemUrl);

  const data = (await response.json()) as StableswapItemResponse;

  //TODO: make model with blockInfo
  return data.item;
};
