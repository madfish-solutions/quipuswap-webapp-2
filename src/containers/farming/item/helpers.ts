import BigNumber from 'bignumber.js';

import { ZERO_ADDRESS } from '@app.config';
import { FarmingItem } from '@interfaces/farming.interfaces';
import { isTezosToken } from '@utils/helpers';
import { Nullable, Optional, WhitelistedBaker } from '@utils/types';
import { numberAsStringSchema } from '@utils/validators/number-as-string';

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
