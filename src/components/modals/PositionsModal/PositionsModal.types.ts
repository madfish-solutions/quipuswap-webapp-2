import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export interface IPositionsModalProps {
  onChange: (tokenPair: WhitelistedTokenPair) => void;
  initialPair: Nullable<WhitelistedTokenPair>;
  notSelectable1?: WhitelistedToken;
  notSelectable2?: WhitelistedToken;
  blackListedTokens?: WhitelistedToken[];
}

export enum PositionsModalFormField {
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
  [PositionsModalFormField.SEARCH]: string;
  [PositionsModalFormField.TOKEN_ID]: string;
  [PositionsModalFormField.FIRST_TOKEN]: WhitelistedToken;
  [PositionsModalFormField.SECOND_TOKEN]: WhitelistedToken;
}
