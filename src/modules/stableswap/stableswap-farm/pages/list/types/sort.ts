export enum StableswapFarmSortField {
  ID = 'ID',
  APR = 'APR',
  APY = 'APY',
  TVL = 'TVL',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

export interface StableswapFarmSortFieldItem {
  label: string;
  field: StableswapFarmSortField;
}
