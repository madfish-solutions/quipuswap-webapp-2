import { ZERO_ADDRESS } from '@config/constants';
import { FarmingItemV1Model } from '@modules/farming/models';
import { isTezosToken, unpackOption } from '@shared/helpers';
import { Option, WhitelistedBaker } from '@shared/types';

export const makeBaker = (delegateAddress: Option<string> | string, knownBakers: WhitelistedBaker[]) => {
  if (typeof delegateAddress === 'object' && delegateAddress != null && 'Some' in delegateAddress) {
    delegateAddress = unpackOption(delegateAddress);
  }

  if (typeof delegateAddress === 'string' && delegateAddress !== ZERO_ADDRESS) {
    return knownBakers.find(({ address }) => address === delegateAddress) ?? { address: delegateAddress };
  }

  return null;
};

export const canDelegate = (farmingItem: FarmingItemV1Model) => farmingItem.tokens.some(isTezosToken);
