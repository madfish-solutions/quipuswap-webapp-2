import { FormEvent } from 'react';

import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface UnstakeFormProps {
  inputAmount: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
  isSubmitting: boolean;
  balance: Nullable<BigNumber>;
  tokens: Token[];
}
