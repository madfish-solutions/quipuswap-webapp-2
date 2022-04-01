import { Nullable, Token, TokenPair } from '@shared/types';

export interface IPositionsModalProps {
  onChange: (tokenPair: TokenPair) => void;
  initialPair: Nullable<TokenPair>;
  notSelectable1?: Token;
  notSelectable2?: Token;
  blackListedTokens?: Token[];
}

export enum PMFormField {
  FIRST_TOKEN = 'firstToken',
  SECOND_TOKEN = 'secondToken',
  SEARCH = 'search',
  TOKEN_ID = 'tokenId'
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
  [PMFormField.SEARCH]: string;
  [PMFormField.TOKEN_ID]: string;
  [PMFormField.FIRST_TOKEN]: Token;
  [PMFormField.SECOND_TOKEN]: Token;
}
