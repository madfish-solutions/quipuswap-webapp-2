import { ZERO_AMOUNT_BN } from '@config/constants';
import { getSumOfNumbers } from '@shared/helpers';

import { FarmingListItemWithBalances } from '../types';

export const calculateTotalDeposit = (item: Array<FarmingListItemWithBalances>) =>
  getSumOfNumbers(
    item.map(
      ({ depositBalance, depositExchangeRate }) => depositBalance?.multipliedBy(depositExchangeRate) ?? ZERO_AMOUNT_BN
    )
  );
