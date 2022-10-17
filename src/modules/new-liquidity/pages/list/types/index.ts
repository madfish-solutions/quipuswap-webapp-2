export enum LiquiditySortField {
  ID = 'ID',
  TVL = 'TVL'
}

export interface LiquiditySortFieldItem {
  label: string;
  field: LiquiditySortField;
}
