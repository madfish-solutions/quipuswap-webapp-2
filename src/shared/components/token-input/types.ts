import BigNumber from 'bignumber.js';

import { Optional, Token } from '@shared/types';

type Tokens = Token | Array<Token>;

export interface TokenInputViewModelProps {
  value: string;
  tokens?: Tokens;
  onInputChange: (value: string) => void;
}

export interface TokenInputProps extends TokenInputViewModelProps {
  id?: string;
  className?: string;

  label: string;

  balance: Optional<BigNumber.Value>;
  dollarEquivalent?: Optional<BigNumber.Value>;

  readOnly?: boolean;

  hidePercentSelector?: boolean;

  error?: string;
  onSelectorClick?: () => void;
}
