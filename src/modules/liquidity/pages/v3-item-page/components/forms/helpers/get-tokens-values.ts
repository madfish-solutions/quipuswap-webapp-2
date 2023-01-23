import { BigNumber } from 'bignumber.js';
import { FormikValues } from 'formik';

import { toAtomic } from '@shared/helpers';
import { Token } from '@shared/types';

import { V3AddTokenInput } from '../interface';

export const getTokensValues = (inputAmounts: FormikValues, tokenX: Token, tokenY: Token) => ({
  x: toAtomic(new BigNumber(inputAmounts[V3AddTokenInput.firstTokenInput]), tokenX).integerValue(BigNumber.ROUND_CEIL),
  y: toAtomic(new BigNumber(inputAmounts[V3AddTokenInput.secondTokenInput]), tokenY).integerValue(BigNumber.ROUND_CEIL)
});
