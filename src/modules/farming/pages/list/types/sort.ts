export enum FarmingSortField {
  ID = 'ID',
  APR = 'APR',
  APY = 'APY',
  TVL = 'TVL',
  BALANCE = 'BALANCE',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

export interface FarmingSortFieldItem {
  label: string;
  field: FarmingSortField;
}
