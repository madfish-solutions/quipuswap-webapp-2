export enum SortType {
  APR = 'APR',
  APY = 'APY',
  TVL = 'TVL',
  BALANCE = 'BALANCE',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

export interface SortValue {
  label: string;
  value: SortType;
  up: boolean;
}
