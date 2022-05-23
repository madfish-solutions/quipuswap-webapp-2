import BigNumber from 'bignumber.js';

import { Optional, Token } from '@shared/types';

type Tokens = Token | Array<Token>;

export interface TokenInputViewModelProps {
  value: string;
  tokens?: Tokens;
  exchangeRate?: Nullable<BigNumber.Value>;
  decimals: number;
  balance: Optional<BigNumber.Value>;
  readOnly?: boolean;
  hiddenPercentSelector?: boolean;
  onInputChange: (value: string) => void;
}

export interface TokenInputProps extends TokenInputViewModelProps {
  id?: string;
  className?: string;
  label: string;
  error?: string;
  tokensLoading?: boolean;
  onSelectorClick?: () => void;
}
