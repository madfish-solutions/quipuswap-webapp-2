import { BigNumber } from 'bignumber.js';
import { FormikValues } from 'formik';

import { toAtomic } from '@shared/helpers';
import { Token } from '@shared/types';

import { V3RemoveTokenInput } from '../interface';

export const getTokensValues = (inputAmounts: FormikValues, tokenX: Token, tokenY: Token) => ({
  x: toAtomic(new BigNumber(inputAmounts[V3RemoveTokenInput.tokenXOutput]), tokenX).integerValue(BigNumber.ROUND_DOWN),
  y: toAtomic(new BigNumber(inputAmounts[V3RemoveTokenInput.tokenYOutput]), tokenY).integerValue(BigNumber.ROUND_DOWN)
});
