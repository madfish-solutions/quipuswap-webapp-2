import { Params } from 'react-router-dom';

import { ZERO_ADDRESS } from '@config/constants';
import { FarmingItemModel } from '@modules/farming/models';
import { isTezosToken } from '@shared/helpers';
import { Optional, WhitelistedBaker } from '@shared/types';

const SEPARATOR = '/';
const ID_INDEX_V1 = 1;
const ID_INDEX_V2 = 0;
const V2_ROUTER_LENGTH = 1;

export const makeBaker = (delegateAddress: Optional<string>, knownBakers: WhitelistedBaker[]) => {
  if (typeof delegateAddress === 'string' && delegateAddress !== ZERO_ADDRESS) {
    return knownBakers.find(({ address }) => address === delegateAddress) ?? { address: delegateAddress };
  }

  return null;
};

export const canDelegate = (farmingItem: FarmingItemModel) => farmingItem.tokens.some(isTezosToken);

export const getFarmingIdAndType = (params: Readonly<Params<string>>) => {
  const routerParts = params['*']?.split(SEPARATOR) ?? [];

  const old = routerParts.length > V2_ROUTER_LENGTH;
  const rawStakeId = old ? routerParts[ID_INDEX_V1] : routerParts[ID_INDEX_V2];

  return { rawStakeId, old };
};
