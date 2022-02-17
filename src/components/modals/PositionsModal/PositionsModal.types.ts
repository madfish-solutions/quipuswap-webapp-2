import { Nullable, RawToken, TokenPair } from '@interfaces/types';

export interface IPositionsModalProps {
  onChange: (tokenPair: TokenPair) => void;
  initialPair: Nullable<TokenPair>;
  notSelectable1?: RawToken;
  notSelectable2?: RawToken;
  blackListedTokens?: RawToken[];
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
  [PMFormField.FIRST_TOKEN]: RawToken;
  [PMFormField.SECOND_TOKEN]: RawToken;
}
