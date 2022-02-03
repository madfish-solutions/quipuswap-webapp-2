export enum TokensModalFormField {
  SEARCH = 'search',
  TOKEN_ID = 'tokenId'
}

export interface FormValues {
  [TokensModalFormField.SEARCH]: string;
  [TokensModalFormField.TOKEN_ID]: number | string;
}
