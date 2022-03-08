import { ZERO_ADDRESS } from '@app.config';
import { StakingItem } from '@interfaces/staking.interfaces';
import { isTezosToken } from '@utils/helpers';
import { Optional, WhitelistedBaker } from '@utils/types';

export const makeBaker = (delegateAddress: Optional<string>, knownBakers: WhitelistedBaker[]) => {
  if (typeof delegateAddress === 'string' && delegateAddress !== ZERO_ADDRESS) {
    return knownBakers.find(({ address }) => address === delegateAddress) ?? { address: delegateAddress };
  }

  return null;
};

export const canDelegate = (stakeItem: StakingItem) => isTezosToken(stakeItem.tokenA);
