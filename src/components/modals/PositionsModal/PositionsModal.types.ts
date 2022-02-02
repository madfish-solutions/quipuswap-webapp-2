import { Nullable, Token, TokenPair } from '@utils/types';

export interface IPositionsModalProps {
  onChange: (tokenPair: TokenPair) => void;
  initialPair: Nullable<TokenPair>;
  notSelectable1?: Token;
  notSelectable2?: Token;
}

export interface HeaderProps {
  isSecondInput: boolean;
  debounce: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

export interface FormValues {
  search: string;
  tokenId: string;
  token1: Token;
  token2: Token;
}
