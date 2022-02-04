export enum TMFormField {
  SEARCH = 'search',
  TOKEN_ID = 'tokenId'
}

export interface FormValues {
  [TMFormField.SEARCH]: string;
  [TMFormField.TOKEN_ID]: number | string;
}
