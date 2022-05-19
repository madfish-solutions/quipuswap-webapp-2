import BigNumber from 'bignumber.js';

import { Optional, Token } from '@shared/types';

type Tokens = Token | Array<Token>;

export interface TokenInputViewModelProps {
  value: string;
  tokens: Tokens;
  exchangeRate?: Nullable<BigNumber.Value>;
  decimals: number;
  onInputChange: (value: string) => void;
}

export interface TokenInputProps extends TokenInputViewModelProps {
  id: string;
  className?: string;

  label: string;

  balance: Optional<BigNumber.Value>;
  readOnly?: boolean;

  hidePercentSelector?: boolean;

  error?: string;
  tokensLoading?: boolean;
  onSelectorClick?: () => void;
}
