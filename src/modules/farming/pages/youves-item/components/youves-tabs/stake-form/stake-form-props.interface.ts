import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface StakeFormProps {
  inputAmount: string;
  handleSubmit: () => void;
  handleInputAmountChange: (value: string) => void;
  disabled: boolean;
  isSubmitting: boolean;
  inputAmountError?: string;
  balance: Nullable<BigNumber>;
  investHref: string;
  tokens: Token[];
}
