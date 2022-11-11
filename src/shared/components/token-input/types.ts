import BigNumber from 'bignumber.js';

import { Nullable, Optional, Token } from '@shared/types';

export type Tokens = Nullable<Token> | Array<Nullable<Token>>;

export interface TokenInputViewModelProps {
  tokens?: Tokens;
  readOnly?: boolean;
  disabled?: boolean;
  hiddenPercentSelector?: boolean;
  hiddenBalance?: boolean;
  onInputChange: (value: string) => void;
}

export interface TokenInputProps extends TokenInputViewModelProps {
  value: Nullable<string>;
  balance?: Optional<BigNumber.Value>;
  balanceText?: string;
  id?: string;
  className?: string;
  label: string;
  error?: string;
  decimals?: number;
  dollarEquivalent?: Optional<BigNumber.Value>;
  tokenInputDTI?: string;
  onSelectorClick?: () => void;
}
