import BigNumber from 'bignumber.js';

import { Optional, Token } from '@shared/types';

export type Tokens = Token | Array<Token>;

export interface TokenInputViewModelProps {
  tokens?: Tokens;
  readOnly?: boolean;
  disabled?: boolean;
  hiddenPercentSelector?: boolean;
  hiddenBalance?: boolean;
  onInputChange: (value: string) => void;
  onSelectorClick?: () => void | Promise<void>;
}

export interface TokenInputProps extends TokenInputViewModelProps {
  value: string;
  balance?: Optional<BigNumber.Value>;
  balanceText?: string;
  id?: string;
  index?: number;
  className?: string;
  label: string;
  error?: string;
  decimals?: number;
  dollarEquivalent?: Optional<BigNumber.Value>;
  tokenInputDTI?: string;
}
