import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface IPositionsModalProps {
  onChange: (tokenPair: WhitelistedTokenPair) => void;
  initialPair: Nullable<WhitelistedTokenPair>;
  notSelectable1?: WhitelistedToken;
  notSelectable2?: WhitelistedToken;
  blackListedTokens?: WhitelistedToken[];
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
  [PMFormField.FIRST_TOKEN]: WhitelistedToken;
  [PMFormField.SECOND_TOKEN]: WhitelistedToken;
}
