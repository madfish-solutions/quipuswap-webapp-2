export enum StableDividendsSortField {
  ID = 'ID',
  APR = 'APR',
  APY = 'APY',
  TVL = 'TVL',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

export interface StableDividendsSortFieldItem {
  label: string;
  field: StableDividendsSortField;
}
