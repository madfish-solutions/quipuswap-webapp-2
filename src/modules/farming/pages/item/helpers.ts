import { ZERO_ADDRESS } from '@config/constants';
import { FarmingItemV1Model } from '@modules/farming/models';
import { isTezosToken } from '@shared/helpers';
import { Optional, WhitelistedBaker } from '@shared/types';

export const makeBaker = (delegateAddress: Optional<string>, knownBakers: WhitelistedBaker[]) => {
  if (typeof delegateAddress === 'string' && delegateAddress !== ZERO_ADDRESS) {
    return knownBakers.find(({ address }) => address === delegateAddress) ?? { address: delegateAddress };
  }

  return null;
};

export const canDelegate = (farmingItem: FarmingItemV1Model) => farmingItem.tokens.some(isTezosToken);
