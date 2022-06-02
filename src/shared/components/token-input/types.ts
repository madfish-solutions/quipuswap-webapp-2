import BigNumber from 'bignumber.js';

import { Optional, Token } from '@shared/types';

type Tokens = Token | Array<Token>;

export interface TokenInputViewModelProps {
  tokens?: Tokens;
  readOnly?: boolean;
  disabled?: boolean;
  hiddenPercentSelector?: boolean;
  hiddenBalance?: boolean;
  onInputChange: (value: string) => void;
}

export interface TokenInputProps extends TokenInputViewModelProps {
  value: string;
  balance: Optional<BigNumber.Value>;
  id?: string;
  className?: string;
  label: string;
  error?: string;
  dollarEquivalent?: Optional<BigNumber.Value>;
  onSelectorClick?: () => void;
}
