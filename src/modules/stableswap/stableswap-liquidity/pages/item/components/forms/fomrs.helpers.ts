import { BigNumber } from 'bignumber.js';

import { isEmptyString } from '@shared/helpers';

const DEFAULT_INPUT_VALUE = '0';

export const getInputsAmountFormFormikValues = <T extends { [key: string]: string }>(values: T) =>
  Object.values(values).map(value => {
    const candidate = isEmptyString(value) ? DEFAULT_INPUT_VALUE : value;

    return new BigNumber(candidate);
  });
