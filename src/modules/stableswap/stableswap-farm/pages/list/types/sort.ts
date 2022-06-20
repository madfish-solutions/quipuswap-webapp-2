export enum StableFarmSortField {
  ID = 'ID',
  APR = 'APR',
  APY = 'APY',
  TVL = 'TVL',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

export interface StableFarmSortFieldItem {
  label: string;
  field: StableFarmSortField;
}
