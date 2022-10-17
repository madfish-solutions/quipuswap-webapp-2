import { ZERO_ADDRESS } from '@config/constants';
import { FarmingItemModel } from '@modules/farming/models';
import { isTezosToken } from '@shared/helpers';
import { Optional, WhitelistedBaker } from '@shared/types';

export const makeBaker = (delegateAddress: Optional<string>, knownBakers: WhitelistedBaker[]) => {
  if (typeof delegateAddress === 'string' && delegateAddress !== ZERO_ADDRESS) {
    return knownBakers.find(({ address }) => address === delegateAddress) ?? { address: delegateAddress };
  }

  return null;
};

export const canDelegate = (farmingItem: FarmingItemModel) => farmingItem.tokens.some(isTezosToken);
