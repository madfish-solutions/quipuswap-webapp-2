import { BigNumber } from 'bignumber.js';

import { ZERO_ADDRESS } from '@config/constants';
import { FarmingItem } from '@modules/farming/interfaces';
import { isTezosToken } from '@shared/helpers';
import { Nullable, Optional, WhitelistedBaker } from '@shared/types';
import { numberAsStringSchema } from '@shared/validators';

const ZERO = 0;

export const makeBaker = (delegateAddress: Optional<string>, knownBakers: WhitelistedBaker[]) => {
  if (typeof delegateAddress === 'string' && delegateAddress !== ZERO_ADDRESS) {
    return knownBakers.find(({ address }) => address === delegateAddress) ?? { address: delegateAddress };
  }

  return null;
};

export const canDelegate = (farmingItem: FarmingItem) => isTezosToken(farmingItem.tokenA);

export const operationAmountSchema = (balance: Nullable<BigNumber>) =>
  balance
    ? numberAsStringSchema(
        { value: ZERO, isInclusive: false },
        { value: balance, isInclusive: true },
        'The value should be greater than zero.',
        `Max available value is ${balance.toNumber()}`
      )
    : numberAsStringSchema();
