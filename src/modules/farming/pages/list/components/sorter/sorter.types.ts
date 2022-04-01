export enum SortField {
  ID = 'ID',
  APR = 'APR',
  APY = 'APY',
  TVL = 'TVL',
  BALANCE = 'BALANCE',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

export interface SortFieldItem {
  label: string;
  field: SortField;
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}
